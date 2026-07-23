import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  const adapter = new PrismaPg({ connectionString: url });
  const p = new PrismaClient({ adapter });
  const user = await p.user.findUnique({
    where: { email: "nourheneazzoune@gmail.com" },
    select: { agency: { select: { slug: true, name: true, id: true } } },
  });
  console.log(JSON.stringify(user?.agency ?? null, null, 2));
  await p['$disconnect']();
}

main();
