import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL?.trim();
const hasPostgresEnvironment = Boolean(
  process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE,
);

if (!databaseUrl && !hasPostgresEnvironment) {
  console.error("No PostgreSQL connection was found. Set DATABASE_URL or the managed PG* variables.");
  process.exit(1);
}

const pool = databaseUrl
  ? new pg.Pool({ connectionString: databaseUrl, max: 2 })
  : new pg.Pool({ max: 2 });

try {
  const migrationDir = path.join(process.cwd(), "migrations");
  const migrations = (await fs.readdir(migrationDir))
    .filter((file) => /^\d+_.*\.sql$/.test(file))
    .sort();

  for (const file of migrations) {
    const migration = await fs.readFile(path.join(migrationDir, file), "utf8");
    await pool.query(migration);
    console.log(`Applied ${file}.`);
  }
} finally {
  await pool.end();
}