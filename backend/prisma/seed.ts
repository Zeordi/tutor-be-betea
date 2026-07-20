import { PrismaClient, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type AdminSeed = {
  email: string;
  fullName: string;
  phone: string;
  password: string;
};

function parseTeamEmails(): string[] {
  const raw = process.env.ADMIN_TEAM_EMAILS || process.env.ADMIN_EMAIL || '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function buildAdminSeeds(): AdminSeed[] {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 10) {
    throw new Error(
      'ADMIN_PASSWORD env var is required (min 10 chars) to seed team admins',
    );
  }

  const emails = parseTeamEmails();
  if (!emails.length) {
    throw new Error('Set ADMIN_EMAIL or ADMIN_TEAM_EMAILS to seed admin users');
  }

  const fullName = process.env.ADMIN_FULL_NAME || 'Platform Admin';
  const basePhone = process.env.ADMIN_PHONE || '+251900000000';

  return emails.map((email, index) => ({
    email,
    fullName: emails.length === 1 ? fullName : `${fullName} ${index + 1}`,
    phone: index === 0 ? basePhone : `${basePhone}${index}`,
    password,
  }));
}

async function upsertAdmin(seed: AdminSeed) {
  const passwordHash = await bcrypt.hash(seed.password, 12);
  await prisma.user.upsert({
    where: { email: seed.email },
    update: {
      passwordHash,
      userType: UserType.ADMIN,
      isVerified: true,
      isActive: true,
      fullName: seed.fullName,
    },
    create: {
      email: seed.email,
      fullName: seed.fullName,
      phone: seed.phone,
      userType: UserType.ADMIN,
      passwordHash,
      isVerified: true,
      isActive: true,
    },
  });
  console.log(`Admin ready: ${seed.email}`);
}

async function main() {
  const admins = buildAdminSeeds();
  for (const admin of admins) {
    await upsertAdmin(admin);
  }
  console.log(`Seeded ${admins.length} team admin(s)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
