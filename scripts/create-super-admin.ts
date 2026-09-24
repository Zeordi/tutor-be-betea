#!/usr/bin/env node
/**
 * create-super-admin.ts
 *
 * One-time bootstrap script to create the first SUPER_ADMIN user.
 *
 * How to run:
 *   1. Ensure DATABASE_URL is set (e.g. in .env or shell).
 *   2. Set FIRST_SUPER_ADMIN_PASSWORD to a strong password.
 *   3. Optionally set FIRST_SUPER_ADMIN_EMAIL (default: ordialex1226@gmail.com)
 *      and FIRST_SUPER_ADMIN_PHONE (default: derived from email).
 *   4. Run:
 *        node --experimental-strip-types scripts/create-super-admin.ts
 *
 * After success, sign in at /login with the email + password you set.
 *
 * Idempotent: if the email already exists, it logs and exits 0.
 *
 * Do NOT commit real passwords to version control.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EMAIL_FALLBACK = "ordialex1226@gmail.com";

function die(msg: string): never {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    die("DATABASE_URL is required");
  }

  const email = (process.env.FIRST_SUPER_ADMIN_EMAIL || EMAIL_FALLBACK).trim().toLowerCase();
  const password = process.env.FIRST_SUPER_ADMIN_PASSWORD;
  if (!password) {
    die("FIRST_SUPER_ADMIN_PASSWORD is required");
  }
  if (password.length < 6) {
    die("FIRST_SUPER_ADMIN_PASSWORD must be at least 6 characters");
  }

  let phone = process.env.FIRST_SUPER_ADMIN_PHONE?.trim();
  if (!phone) {
    const local = email.split("@")[0];
    phone = `+seed-${local}`;
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    console.log(`Super Admin already exists for ${email}; skipping`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      phoneNumber: phone,
      email,
      fullName: "Super Admin",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      passwordHash,
      emailVerified: true,
      phoneVerified: true,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      status: true,
    },
  });

  console.log("Super Admin created:", user);
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
