import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Text from '@/models/Text';
import { createHmac } from 'crypto';

export const dynamic = 'force-dynamic';

// Webhook handler (Paystack webhook for server-side verification)
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY!;

    // Verify webhook signature
    const hash = createHmac('sha512', paystackSecret).update(body).digest('hex');
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      const sessionId = metadata?.sessionId || metadata?.custom_fields?.[0]?.value;

      await connectDB();
      await Payment.findOneAndUpdate(
        { paystackReference: reference },
        { status: 'success' },
        { upsert: false }
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// GET — callback from Paystack redirect
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');
    const sessionId = searchParams.get('sessionId');

    if (!reference && !sessionId) {
      return NextResponse.redirect(new URL('/?error=invalid_params', req.url));
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY!;

    // Verify with Paystack
    let refToVerify = reference;
    if (!refToVerify && sessionId) {
      await connectDB();
      const payment = await Payment.findOne({ sessionId });
      refToVerify = payment?.paystackReference;
    }

    if (!refToVerify) {
      return NextResponse.redirect(new URL('/?error=payment_not_found', req.url));
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${refToVerify}`, {
      headers: { Authorization: `Bearer ${paystackSecret}` },
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return NextResponse.redirect(new URL('/?error=payment_failed', req.url));
    }

    const txSessionId = sessionId || verifyData.data.metadata?.sessionId;

    // Update DB
    await connectDB();
    await Payment.findOneAndUpdate(
      { paystackReference: refToVerify },
      { status: 'success' },
      { upsert: false }
    );

    // Get the paraphrased text
    const textDoc = await Text.findOne({ sessionId: txSessionId });
    if (!textDoc) {
      return NextResponse.redirect(new URL('/?error=text_not_found', req.url));
    }

    // Redirect to success page with session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      `${baseUrl}/result?sessionId=${txSessionId}&ref=${refToVerify}`
    );
  } catch (err: any) {
    console.error('Verify error:', err);
    return NextResponse.redirect(new URL('/?error=verification_failed', req.url));
  }
}
