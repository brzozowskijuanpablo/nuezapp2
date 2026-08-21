import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await initDb();
    const db = getDb();
    const { name, email, password, phone, address } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Nombre, email y contrasea son requeridos' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [cleanEmail],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este correo electrnico' },
        { status: 409 }
      );
    }

    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    await db.execute({
      sql: 'INSERT INTO users (id, email, password_hash, name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      args: [userId, cleanEmail, passwordHash, name.trim(), phone?.trim() || '', address?.trim() || ''],
    });

    const token = generateToken();
    await db.execute({
      sql: 'INSERT INTO sessions (token, user_id) VALUES (?, ?)',
      args: [token, userId],
    });

    const userProfile = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone?.trim() || '',
      address: address?.trim() || '',
      isLoggedIn: true,
    };

    return NextResponse.json({
      success: true,
      token,
      user: userProfile,
    });
  } catch (error) {
    console.error('Error in register:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}
