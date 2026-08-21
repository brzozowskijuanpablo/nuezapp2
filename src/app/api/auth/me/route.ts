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
  } catch (error) {
    console.error('Error in me route:', error);
    return NextResponse.json({ error: 'Error al verificar sesin' }, { status: 500 });
  }
}
