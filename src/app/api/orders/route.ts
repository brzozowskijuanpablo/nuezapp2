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
    const res = await db.execute({
      sql: 'SELECT id, items, total, status, shipping_address, phone, payment_method, notes, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      args: [userId],
    });

    const orders = res.rows.map(row => {
      let items = [];
      try {
        items = JSON.parse(row.items as string);
      } catch (e) {
        items = [];
      }
      return {
        id: row.id,
        items,
        total: row.total,
        status: row.status,
        shippingAddress: row.shipping_address,
        phone: row.phone,
        paymentMethod: row.payment_method,
        notes: row.notes,
        createdAt: row.created_at,
      };
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initDb();
    const db = getDb();
    let userId = await getUserIdFromToken(req);
    const body = await req.json();
    const { items, total, shippingAddress, phone, paymentMethod, notes, guestUser } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El pedido est vaco' }, { status: 400 });
    }

    // If not logged in but provided guest details, ensure we link or create guest user if needed
    if (!userId && guestUser?.email) {
      const cleanEmail = guestUser.email.trim().toLowerCase();
      const existing = await db.execute({
        sql: 'SELECT id FROM users WHERE email = ?',
        args: [cleanEmail],
      });
      if (existing.rows.length > 0) {
        userId = existing.rows[0].id as string;
      } else {
        userId = crypto.randomUUID();
        await db.execute({
          sql: 'INSERT INTO users (id, email, password_hash, name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
          args: [userId, cleanEmail, 'GUEST_NO_PASSWORD', guestUser.name || 'Invitado', phone || '', shippingAddress || ''],
        });
      }
    }

    if (!userId) {
      // Create an anonymous guest user id
      userId = crypto.randomUUID();
      const guestEmail = `guest_${Date.now()}@nuezapp.local`;
      await db.execute({
        sql: 'INSERT INTO users (id, email, password_hash, name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        args: [userId, guestEmail, 'GUEST_NO_PASSWORD', 'Cliente WhatsApp', phone || '', shippingAddress || ''],
      });
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsJson = JSON.stringify(items);

    await db.execute({
      sql: `INSERT INTO orders (id, user_id, items, total, status, shipping_address, phone, payment_method, notes) 
            VALUES (?, ?, ?, ?, 'confirmado', ?, ?, ?, ?)`,
      args: [orderId, userId, itemsJson, total || 0, shippingAddress || '', phone || '', paymentMethod || 'Efectivo/Transferencia', notes || ''],
    });

    // Clear cart for this user in DB if user exists
    await db.execute({
      sql: 'DELETE FROM carts WHERE user_id = ?',
      args: [userId],
    });

    return NextResponse.json({
      success: true,
      orderId,
      order: {
        id: orderId,
        items,
        total,
        status: 'confirmado',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Error al registrar pedido' }, { status: 500 });
  }
}
