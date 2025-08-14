import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      ca: fs.readFileSync('certs/rds-combined-ca-bundle.pem').toString(),
      // rejectUnauthorized: true // デフォルトで有効
    },
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW()');
    res.status(200).json({ time: result.rows[0].now });
  } catch (err) {
    console.error('DB接続失敗:', err);
    res.status(500).json({ error: 'DB接続失敗' });
  } finally {
    await client.end();
  }
}
