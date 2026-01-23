import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const plans = [
    { amount: 500,  discountPercent: 12 },
    { amount: 1000, discountPercent: 12 },
    { amount: 2000, discountPercent: 12 },
    { amount: 5000, discountPercent: 12 },
    { amount: 10000, discountPercent: 12 },
    { amount: 20000, discountPercent: 12 },
  ];

  for (const p of plans) {
    const plan = await prisma.plan.create({
      data: {
        title: `${p.amount} DH`,        // <--- NEW: Added Title
        amount: p.amount,
        originalPrice: p.amount,        // <--- NEW: Added Original Price
        discountPercent: p.discountPercent,
        isActive: true,
      },
    });
    console.log(`Created plan with id: ${plan.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });