import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/models/Payment';

// Simple admin key verification (in production, use JWT or sessions)
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'admin_key_change_in_production';

function verifyAdminAuth(req: NextRequest): boolean {
  const adminKey = req.headers.get('x-admin-key');
  return adminKey === ADMIN_SECRET;
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdminAuth(req)) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid admin key.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { paymentId, action, rejectionReason } = body;

    if (!paymentId || !action) {
      return NextResponse.json(
        { error: 'Payment ID and action are required.' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject".' },
        { status: 400 }
      );
    }

    await connectDB();

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found.' }, { status: 404 });
    }

    if (payment.paymentStatus !== 'pending') {
      return NextResponse.json(
        { error: `Payment is already ${payment.paymentStatus}. Cannot modify.` },
        { status: 400 }
      );
    }

    // Update payment status
    if (action === 'approve') {
      payment.paymentStatus = 'approved';
      payment.approvedAt = new Date();
      payment.approvedBy = 'admin';
    } else if (action === 'reject') {
      payment.paymentStatus = 'rejected';
      payment.rejectionReason = rejectionReason || 'Payment rejected by admin.';
    }

    await payment.save();

    return NextResponse.json({
      success: true,
      paymentId: payment._id,
      paymentStatus: payment.paymentStatus,
      message: `Payment ${action}ed successfully.`,
      approvedAt: payment.approvedAt,
      rejectionReason: payment.rejectionReason,
    });
  } catch (err: any) {
    console.error('Payment approval error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process payment approval.' },
      { status: 500 }
    );
  }
}
