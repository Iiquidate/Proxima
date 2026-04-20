import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { Pool } from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...(isProduction && { ssl: { rejectUnauthorized: false } }),
});

export default pool;