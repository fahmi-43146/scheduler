import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
  })
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Validate database connection
prisma.$connect()
  .then(() => {
    console.log('[prisma] Database connection established')
  })
  .catch((error) => {
    console.error('[prisma] Database connection failed:', error)
    process.exit(1)
  })

