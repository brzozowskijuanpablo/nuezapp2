import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

export async function GET(req: Request) {
  try {
    await initDb();
    const db = getDb();
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const sessionRes = await db.execute({
      sql: `SELECT u.id, u.email, u.name, u.phone, u.address 
            FROM sessions s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.token = ?`,
      args: [token],
    });

    if (sessionRes.rows.length === 0) {
      return NextResponse.json({ error: 'Sesin invlida o expirada' }, { status: 401 });
    }

    const userRow = sessionRes.rows[0];

    // Get cart
    let cartItems = [];
    const cartRes = await db.execute({
      sql: 'SELECT items FROM carts WHERE user_id = ?',
      args: [userRow.id as string],
    });
    if (cartRes.rows.length > 0) {
      try {
        cartItems = JSON.parse(cartRes.rows[0].items as string);
      } catch (e) {
        cartItems = [];
      }
    }

    const userProfile = {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      phone: userRow.phone || '',
      address: userRow.address || '',
      isLoggedIn: true,
    };

    return NextResponse.json({
      success: true,
      user: userProfile,
      cart: cartItems,
    });
  } catch (error: any) {
    console.error('Error in me route:', error);
    return NextResponse.json({ error: error?.message || 'Error al verificar sesión' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await initDb();
    const db = getDb();
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const body = await req.json();
    const { name, phone, address, email, id } = body;

    let userId: string | null = null;

    if (token) {
      const sessionRes = await db.execute({
        sql: `SELECT user_id FROM sessions WHERE token = ?`,
        args: [token],
      });
      if (sessionRes.rows.length > 0) {
        userId = sessionRes.rows[0].user_id as string;
      }
    }

    if (!userId && (id || email)) {
      const userLookup = await db.execute({
        sql: `SELECT id FROM users WHERE id = ? OR email = ?`,
        args: [id || '', email?.trim().toLowerCase() || ''],
      });
      if (userLookup.rows.length > 0) {
        userId = userLookup.rows[0].id as string;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'No se encontró la sesión o usuario para actualizar' }, { status: 401 });
    }

    await db.execute({
      sql: `UPDATE users SET 
              name = COALESCE(?, name), 
              phone = COALESCE(?, phone), 
              address = COALESCE(?, address) 
            WHERE id = ?`,
      args: [name?.trim() || null, phone?.trim() || null, address?.trim() || null, userId],
    });

    const updatedUserRes = await db.execute({
      sql: `SELECT id, email, name, phone, address FROM users WHERE id = ?`,
      args: [userId],
    });

    const row = updatedUserRes.rows[0];
    const userProfile = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || '',
      address: row.address || '',
      isLoggedIn: true,
    };

    return NextResponse.json({
      success: true,
      user: userProfile,
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: error?.message || 'Error al actualizar perfil' }, { status: 500 });
  }
}
