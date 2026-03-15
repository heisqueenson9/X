import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id;

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required.' }, { status: 400 });
    }

    if (paymentId.startsWith('mock_pay_')) {
      return NextResponse.json({
        success: true,
        paymentId: paymentId,
        textId: 'mock_text_id',
        paymentStatus: 'approved',
        amount: 11,
        network: 'Telecel Cash',
        paymentNumber: '0202979378',
        paymentName: 'Paraphrasing X Mock',
        createdAt: new Date(),
        approvedAt: new Date(),
        approvedBy: 'mock_system',
      });
    }

    await connectDB();

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      paymentId: payment._id,
      textId: payment.textId,
      paymentStatus: payment.paymentStatus,
      screenshotPath: payment.screenshotPath,
      amount: payment.amount,
      network: payment.network,
      paymentNumber: payment.paymentNumber,
      paymentName: payment.paymentName,
      createdAt: payment.createdAt,
      approvedAt: payment.approvedAt,
      approvedBy: payment.approvedBy,
      rejectionReason: payment.rejectionReason,
    });
  } catch (err: any) {
    console.error('Payment status error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to retrieve payment status.' },
      { status: 500 }
    );
  }
}
