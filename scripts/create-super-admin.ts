import { PrismaClient } from "../src/generated/prisma/client";
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "مدير النظام";

  if (!email || !password) {
    console.log("Usage: npx tsx scripts/create-super-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("User already exists, updating role...");
    await prisma.user.update({ where: { email }, data: { role: "SUPER_ADMIN" } });
    console.log("Done! User is now SUPER_ADMIN");
    return;
  }

  // Use Better Auth for proper password hashing
  const { auth } = await import("../src/modules/auth/auth");

  const result = await auth.api.signUpEmail({
    body: { name, email, password },
  });

  await prisma.user.update({
    where: { id: result.user.id },
    data: { role: "SUPER_ADMIN", emailVerified: true },
  });

  console.log("Super Admin created successfully!");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
