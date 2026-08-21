import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await initDb();
    const db = getDb();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contrasea son requeridos' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const res = await db.execute({
      sql: 'SELECT id, email, password_hash, name, phone, address FROM users WHERE email = ?',
      args: [cleanEmail],
    });

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: 'Credenciales invlidas' },
        { status: 401 }
      );
    }

    const userRow = res.rows[0];
    const isValid = await verifyPassword(password, userRow.password_hash as string);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales invlidas' },
        { status: 401 }
      );
    }

    const token = generateToken();
    await db.execute({
      sql: 'INSERT INTO sessions (token, user_id) VALUES (?, ?)',
      args: [token, userRow.id as string],
    });

    // Check if user has a saved cart
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
      token,
      user: userProfile,
      cart: cartItems,
    });
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesin' },
      { status: 500 }
    );
  }
}
