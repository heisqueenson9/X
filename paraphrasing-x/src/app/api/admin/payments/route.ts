import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/models/Payment';

// Simple admin key verification
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'admin_key_change_in_production';

function verifyAdminAuth(req: NextRequest): boolean {
  const adminKey = req.headers.get('x-admin-key');
  return adminKey === ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdminAuth(req)) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid admin key.' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get all payments, sorted by created date (newest first)
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      total: payments.length,
      pending: payments.filter(p => p.paymentStatus === 'pending').length,
      approved: payments.filter(p => p.paymentStatus === 'approved').length,
      rejected: payments.filter(p => p.paymentStatus === 'rejected').length,
      payments,
    });
  } catch (err: any) {
    console.error('Fetch payments error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch payments.' },
      { status: 500 }
    );
  }
}
