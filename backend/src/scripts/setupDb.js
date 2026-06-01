import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, "../../sql/schema.sql");

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });

  const schema = fs.readFileSync(schemaPath, "utf8");
  await connection.query(schema);
  console.log("Database schema applied.");

  const dbName = process.env.DB_NAME || "ninamart";
  await connection.changeUser({ database: dbName });

  const email = (process.env.ADMIN_EMAIL || "admin@ninamart.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "aero2025";
  const hash = await bcrypt.hash(password, 12);

  const [admins] = await connection.query("SELECT id FROM admins LIMIT 1");
  if (admins.length === 0) {
    await connection.query("INSERT INTO admins (email, password_hash) VALUES (?, ?)", [email, hash]);
    console.log(`Admin user created: ${email}`);
  } else {
    console.log("Admin user already exists — skipped.");
  }

  const [products] = await connection.query("SELECT id FROM products LIMIT 1");
  if (products.length === 0) {
    console.log("No products found. Start the API server to auto-seed, or POST /api/products/seed/reset after login.");
  }

  await connection.end();
  console.log("Setup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
