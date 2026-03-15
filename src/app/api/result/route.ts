import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Text from '@/models/Text';
import Payment from '@/models/Payment';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const ref = searchParams.get('ref');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required.' }, { status: 400 });
    }

    await connectDB();

    // Check payment status
    const payment = await Payment.findOne({
      $or: [{ sessionId }, { paystackReference: ref }],
      status: 'success',
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not verified.' }, { status: 402 });
    }

    // Get paraphrased text
    const textDoc = await Text.findOne({ sessionId });
    if (!textDoc) {
      return NextResponse.json({ error: 'Result not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      paraphrasedText: textDoc.paraphrasedText,
      stats: textDoc.stats,
      mode: textDoc.mode,
    });
  } catch (err: any) {
    console.error('Result fetch error:', err);
    return NextResponse.json({ error: 'Failed to retrieve result.' }, { status: 500 });
  }
}
