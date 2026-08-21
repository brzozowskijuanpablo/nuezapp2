import { createClient, Client } from '@libsql/client';

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL || process.env.NODE_ENV === 'production';
    const fallbackDb = isVercel ? 'file:/tmp/nuezapp.db' : 'file:nuezapp.db';
    const url = process.env.TURSO_DATABASE_URL || fallbackDb;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    
    client = createClient({
      url,
      authToken,
    });
  }
  return client;
}

let initialized = false;

export async function initDb() {
  if (initialized) return;
  const db = getDb();

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS carts (
      user_id TEXT PRIMARY KEY,
      items TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pendiente',
      shipping_address TEXT,
      phone TEXT,
      payment_method TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  initialized = true;
}
