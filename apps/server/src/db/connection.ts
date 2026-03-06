import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'proxima',
  password: process.env.DB_PASSWORD || 'proxima',
  database: process.env.DB_NAME || 'proxima',
});

export default pool;