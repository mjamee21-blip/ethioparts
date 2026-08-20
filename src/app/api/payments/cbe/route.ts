import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { referenceNumber, orderId, status, transferredAmount } = body;

    if (!orderId || !referenceNumber || !status) {
      return NextResponse.json({ error: { code: 'INVALID_PAYLOAD', message: 'Missing required CBE Birr parameters' } }, { status: 400 });
    }

    // Update order status in D1 database if binding is available
    // @ts-ignore
    const db = process.env.DB || globalThis.DB;
    if (db) {
      const paymentStatus = status === 'APPROVED' ? 'verified' : 'failed';
      await db.prepare(
        `UPDATE orders SET payment_status = ? WHERE id = ?`
      ).bind(paymentStatus, orderId).run();
    }

    return NextResponse.json({ success: true, message: 'CBE Birr webhook processed successfully', orderId, referenceNumber });
  } catch (error: any) {
    return NextResponse.json({ error: { code: 'SERVER_ERROR', message: error.message } }, { status: 500 });
  }
}
