import { NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    await initDb();
    const db = getDb();
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (token) {
      await db.execute({
        sql: 'DELETE FROM sessions WHERE token = ?',
        args: [token],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in logout:', error);
    return NextResponse.json({ success: true });
  }
}
