import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, transactionId, status, amount, signature } = body;

    // Validate webhook payload for Telebirr
    if (!orderId || !transactionId || !status) {
      return NextResponse.json({ error: { code: 'INVALID_PAYLOAD', message: 'Missing required Telebirr parameters' } }, { status: 400 });
    }

    // In production, verify signature against Telebirr secret key here

    // Update order status in D1 database if binding is available
    // @ts-ignore
    const db = process.env.DB || globalThis.DB;
    if (db) {
      const paymentStatus = status === 'SUCCESS' ? 'verified' : 'failed';
      await db.prepare(
        `UPDATE orders SET payment_status = ? WHERE id = ?`
      ).bind(paymentStatus, orderId).run();
    }

    return NextResponse.json({ success: true, message: 'Telebirr webhook processed successfully', orderId, transactionId });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'SERVER_ERROR', message: error.message } }, { status: 500 });
  }
}
