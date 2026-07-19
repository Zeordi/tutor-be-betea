import { PrismaClient, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@betea.local' },
    update: {},
    create: {
      email: 'admin@betea.local',
      fullName: 'Admin',
      phone: '+251900000000',
      userType: UserType.ADMIN,
      passwordHash,
      isVerified: true,
    },
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
