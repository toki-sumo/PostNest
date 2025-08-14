require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

async function testConnection() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      ca: fs.readFileSync('certs/rds-combined-ca-bundle.pem').toString(),
    },
  });

  try {
    await client.connect();
    console.log("✅ 接続成功");
  } catch (err) {
    console.error("❌ 接続失敗:", err);
  } finally {
    await client.end();
  }
}

testConnection();
