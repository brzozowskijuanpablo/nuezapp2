import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

async function getUserIdFromToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) return null;

  const db = getDb();
  const sessionRes = await db.execute({
    sql: 'SELECT user_id FROM sessions WHERE token = ?',
    args: [token],
  });

  if (sessionRes.rows.length === 0) return null;
  return sessionRes.rows[0].user_id as string;
}

export async function GET(req: Request) {
  try {
    await initDb();
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const db = getDb();
    const cartRes = await db.execute({
      sql: 'SELECT items FROM carts WHERE user_id = ?',
      args: [userId],
    });

    let items = [];
    if (cartRes.rows.length > 0) {
      try {
        items = JSON.parse(cartRes.rows[0].items as string);
      } catch (e) {
        items = [];
      }
    }

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Error getting cart:', error);
    return NextResponse.json({ error: 'Error al obtener carrito' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDb();
    const userId = await getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { items } = await req.json();
    const itemsJson = JSON.stringify(items || []);

    const db = getDb();
    await db.execute({
      sql: `INSERT INTO carts (user_id, items, updated_at) 
            VALUES (?, ?, CURRENT_TIMESTAMP) 
            ON CONFLICT(user_id) DO UPDATE SET 
              items = excluded.items, 
              updated_at = CURRENT_TIMESTAMP`,
      args: [userId, itemsJson],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Error al guardar carrito' }, { status: 500 });
  }
}
