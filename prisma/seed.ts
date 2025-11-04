// Prisma seed file
// Run with: npm run seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Database seeding started...');
  
  // Add your seed data here
  // Example:
  // await prisma.user.create({
  //   data: { name: 'Test User', email: 'test@example.com' }
  // });
  
  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
