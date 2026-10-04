// Creates the tables on the database in DATABASE_URL.
//   node --env-file=.env scripts/db-setup.mjs          # schema only
//   node --env-file=.env scripts/db-setup.mjs --seed   # schema + starter content (empty DB only)
import { readFile } from "node:fs/promises";
import { Pool } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const files = ["db/schema.sql", ...(process.argv.includes("--seed") ? ["db/seed.sql"] : [])];
const pool = new Pool({ connectionString: url });
try {
  for (const file of files) {
    await pool.query(await readFile(new URL(`../${file}`, import.meta.url), "utf8"));
    console.log(`Applied ${file}`);
  }
} finally {
  await pool.end();
}
