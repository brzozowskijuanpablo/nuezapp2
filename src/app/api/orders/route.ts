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
    const db = getDb();
    let userId = await getUserIdFromToken(req);

    // Fallback: Check email in search params or headers if token is not available
    if (!userId) {
      const url = new URL(req.url);
      const email = url.searchParams.get('email');
      if (email) {
        const userRes = await db.execute({
          sql: 'SELECT id FROM users WHERE email = ?',
          args: [email.trim().toLowerCase()]
        });
        if (userRes.rows.length > 0) {
          userId = userRes.rows[0].id as string;
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const res = await db.execute({
      sql: 'SELECT id, items, total, status, shipping_address, phone, payment_method, notes, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 100',
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
    const { items, total, shippingAddress, phone, paymentMethod, notes, guestUser, userEmail, userId: directUserId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El pedido está vacío' }, { status: 400 });
    }

    if (!userId && (userEmail || guestUser?.email)) {
      const emailToLookup = (userEmail || guestUser.email).trim().toLowerCase();
      const existing = await db.execute({
        sql: 'SELECT id FROM users WHERE email = ?',
        args: [emailToLookup],
      });
      if (existing.rows.length > 0) {
        userId = existing.rows[0].id as string;
      }
    }

    if (!userId && directUserId) {
      userId = directUserId;
    }

    // If still no user, create or associate guest
    if (!userId) {
      userId = crypto.randomUUID();
      const cleanEmail = (guestUser?.email || `guest_${Date.now()}@nuezapp.local`).trim().toLowerCase();
      await db.execute({
        sql: 'INSERT INTO users (id, email, password_hash, name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        args: [userId, cleanEmail, 'GUEST_NO_PASSWORD', guestUser?.name || 'Cliente WhatsApp', phone || '', shippingAddress || ''],
      });
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsJson = JSON.stringify(items);

    await db.execute({
      sql: `INSERT INTO orders (id, user_id, items, total, status, shipping_address, phone, payment_method, notes) 
            VALUES (?, ?, ?, ?, 'confirmado', ?, ?, ?, ?)`,
      args: [orderId, userId, itemsJson, total || 0, shippingAddress || '', phone || '', paymentMethod || 'Efectivo/Transferencia', notes || ''],
    });

    // Mantener un historial máximo de 100 pedidos por usuario en la base de datos
    await db.execute({
      sql: `DELETE FROM orders WHERE user_id = ? AND id NOT IN (
              SELECT id FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 100
            )`,
      args: [userId, userId],
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
        shippingAddress,
        phone,
        paymentMethod: paymentMethod || 'Efectivo/Transferencia',
        notes,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Error al registrar pedido' }, { status: 500 });
  }
}
