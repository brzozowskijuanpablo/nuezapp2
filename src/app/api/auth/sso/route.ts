import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await initDb();
    const db = getDb();
    const body = await req.json();
    const { provider, email, name, phone, address } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido para SSO' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = name?.trim() || cleanEmail.split('@')[0];

    // Check if user exists
    const existing = await db.execute({
      sql: 'SELECT id, email, name, phone, address FROM users WHERE email = ?',
      args: [cleanEmail],
    });

    let userId: string;
    let userProfile: any;

    if (existing.rows.length > 0) {
      const userRow = existing.rows[0];
      userId = userRow.id as string;
      userProfile = {
        id: userId,
        name: userRow.name || displayName,
        email: userRow.email,
        phone: userRow.phone || phone || '',
        address: userRow.address || address || '',
        isLoggedIn: true,
      };
    } else {
      userId = crypto.randomUUID();
      const ssoTag = `SSO_${(provider || 'OAUTH').toUpperCase()}`;
      await db.execute({
        sql: 'INSERT INTO users (id, email, password_hash, name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        args: [userId, cleanEmail, ssoTag, displayName, phone || '', address || ''],
      });

      userProfile = {
        id: userId,
        name: displayName,
        email: cleanEmail,
        phone: phone || '',
        address: address || '',
        isLoggedIn: true,
      };
    }

    // Create new session token
    const token = generateToken();
    await db.execute({
      sql: 'INSERT INTO sessions (token, user_id) VALUES (?, ?)',
      args: [token, userId],
    });

    // Check if user has a saved cart
    let cartItems = [];
    const cartRes = await db.execute({
      sql: 'SELECT items FROM carts WHERE user_id = ?',
      args: [userId],
    });
    if (cartRes.rows.length > 0) {
      try {
        cartItems = JSON.parse(cartRes.rows[0].items as string);
      } catch (e) {
        cartItems = [];
      }
    }

    return NextResponse.json({
      success: true,
      token,
      user: userProfile,
      cart: cartItems,
    });
  } catch (error: any) {
    console.error('Error in SSO route:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al procesar autenticación SSO' },
      { status: 500 }
    );
  }
}
