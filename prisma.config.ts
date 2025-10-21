import { PrismaClient } from '@prisma/client'

const config = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}

export default config