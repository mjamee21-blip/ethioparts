import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: { code: 'MISSING_CREDENTIALS', message: 'Email and password are required' } }, { status: 400 });
    }

    // @ts-ignore
    const db = process.env.DB || globalThis.DB;
    if (db) {
      const user = await db.prepare(`SELECT * FROM users WHERE email = ? AND password = ?`).bind(email, password).first();
      if (!user) {
        return NextResponse.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } }, { status: 401 });
      }

      if (!user.verified) {
        return NextResponse.json({ error: { code: 'NOT_VERIFIED', message: 'Please verify your email before logging in' } }, { status: 403 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified
        }
      });
    }

    // Fallback mock check if D1 is not bound locally
    if (email === 'admin@ethioparts.et' && password === 'Passw0rd') {
      return NextResponse.json({
        success: true,
        user: { id: 'usr-1', name: 'System Administrator', email, role: 'admin', verified: 1 }
      });
    }

    return NextResponse.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'SERVER_ERROR', message: error.message } }, { status: 500 });
  }
}
