import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'buyer', phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: { code: 'MISSING_FIELDS', message: 'Name, email, and password are required' } }, { status: 400 });
    }

    const userId = `usr-${Date.now()}`;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const joinedDate = new Date().toISOString().split('T')[0];

    // @ts-ignore
    const db = process.env.DB || globalThis.DB;
    if (db) {
      // Check existing user
      const existing = await db.prepare(`SELECT id FROM users WHERE email = ?`).bind(email).first();
      if (existing) {
        return NextResponse.json({ error: { code: 'USER_EXISTS', message: 'User with this email already exists' } }, { status: 409 });
      }

      await db.prepare(
        `INSERT INTO users (id, name, email, password, role, phone, verified, joined_date) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`
      ).bind(userId, name, email, password, role, phone || '', joinedDate).run();
    }

    // In production, send verification email with verificationCode here

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      userId,
      verificationCode // returned for testing/demo purposes
    });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'SERVER_ERROR', message: error.message } }, { status: 500 });
  }
}
