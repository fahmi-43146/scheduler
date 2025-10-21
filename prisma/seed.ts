import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default rooms
  const rooms = [
    { name: 'Physics', icon: 'Atom' },
    { name: 'Biology', icon: 'Microscope' },
    { name: 'Mathematics', icon: 'Calculator' },
    { name: 'Chemistry', icon: 'FlaskConical' },
    { name: 'Genetics', icon: 'Dna' },
    { name: 'Astronomy', icon: 'Telescope' },
    { name: 'Computer Science', icon: 'Cpu' },
    { name: 'Geology', icon: 'Mountain' },
    { name: 'Ecology', icon: 'Leaf' },
    { name: 'Robotics', icon: 'Bot' },
  ]

  console.log('Seeding rooms...')
  
  for (const room of rooms) {
    await prisma.room.upsert({
      where: { name: room.name },
      update: {},
      create: room,
    })
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

