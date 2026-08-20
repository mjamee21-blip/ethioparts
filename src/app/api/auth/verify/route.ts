import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: { code: 'MISSING_EMAIL', message: 'Email is required' } }, { status: 400 });
    }

    // @ts-ignore
    const db = process.env.DB || globalThis.DB;
    if (db) {
      const user = await db.prepare(`SELECT id FROM users WHERE email = ?`).bind(email).first();
      if (!user) {
        return NextResponse.json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } }, { status: 404 });
      }

      await db.prepare(`UPDATE users SET verified = 1 WHERE email = ?`).bind(email).run();
    }

    return NextResponse.json({ success: true, message: 'Email verified successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'SERVER_ERROR', message: error.message } }, { status: 500 });
  }
}
