import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Text from '@/models/Text';
import User from '@/models/User';

// Rate limiting for payment init
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  const existing = requestCounts.get(ip);
  if (!existing || existing.resetAt < now) {
    requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (existing.count >= maxRequests) return false;
  existing.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Basic rate limit
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, sessionId, amount = 1100 } = body;

    if (!email || !sessionId) {
      return NextResponse.json({ error: 'Email and session ID are required.' }, { status: 400 });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json({ error: 'Payment gateway not configured.' }, { status: 500 });
    }

    // Get the base URL for callback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Initialize Paystack transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount, // in pesewas (100 pesewas = GHS 1, so 1100 = GHS 11)
        currency: 'GHS',
        callback_url: `${baseUrl}/api/payment/verify?sessionId=${sessionId}`,
        metadata: {
          sessionId,
          custom_fields: [
            {
              display_name: 'Session ID',
              variable_name: 'session_id',
              value: sessionId,
            },
          ],
        },
        channels: ['mobile_money', 'card', 'bank'],
      }),
    });

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || 'Paystack initialization failed');
    }

    // Save pending payment to DB
    try {
      await connectDB();
      
      // Ensure user exists as requested by db specification
      await User.findOneAndUpdate(
        { email },
        { email },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      await Payment.create({
        sessionId,
        email,
        amount,
        status: 'pending',
        paystackReference: data.data.reference,
      });
    } catch (dbErr) {
      console.error('DB error (non-critical):', dbErr);
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err: any) {
    console.error('Payment init error:', err);
    return NextResponse.json(
      { error: err.message || 'Payment initialization failed.' },
      { status: 500 }
    );
  }
}
