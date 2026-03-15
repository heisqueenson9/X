import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

// Rate limiting
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;

  const existing = requestCounts.get(ip);
  if (!existing || existing.resetAt < now) {
    requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (existing.count >= maxRequests) return false;
  existing.count++;
  return true;
}

// Validate file type by extension AND mime type
function isValidFileType(file: File): boolean {
  const ext = file.name.toLowerCase().split('.').pop();
  const validExts = ['jpg', 'jpeg', 'png'];
  const validMimes = ['image/jpeg', 'image/jpg', 'image/png'];
  return validExts.includes(ext || '') && validMimes.includes(file.type);
}

// Validate file size (5MB max)
function isValidFileSize(size: number): boolean {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return size <= maxSize;
}

// Sanitize string for filename
function sanitizeForFilename(str: string): string {
  return str.replace(/[^a-zA-Z0-9-_]/g, '_').substring(0, 50);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before trying again.' },
        { status: 429 }
      );
    }

    // Get form data
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (err) {
      return NextResponse.json(
        { error: 'Failed to parse form data. Make sure you are sending a multipart form.' },
        { status: 400 }
      );
    }

    const file = formData.get('screenshot') as File;
    const textId = formData.get('textId') as string;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Screenshot file is required.' }, { status: 400 });
    }

    if (!textId || typeof textId !== 'string') {
      return NextResponse.json({ error: 'Text session ID is required.' }, { status: 400 });
    }

    // Sanitize textId
    const safeTextId = sanitizeForFilename(textId);

    // Validate file type
    if (!isValidFileType(file)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, JPEG, and PNG are accepted.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (!isValidFileSize(file.size)) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Create unique filename with timestamp
    const timestamp = Date.now();
    const uuid = randomUUID().substring(0, 8);
    const ext = file.name.toLowerCase().split('.').pop();
    const filename = `payment_${safeTextId}_${timestamp}_${uuid}.${ext}`;
    
    // Store in public/uploads/payments so it can be served statically
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'payments');

    // Create directory if it doesn't exist
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      console.error('Directory creation error:', err);
    }

    // Write file
    const filepath = join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Connect to DB and save payment record
    await connectDB();

    const payment = await Payment.create({
      textId,
      screenshotPath: `/uploads/payments/${filename}`,
      paymentStatus: 'approved',
      amount: 11,
      network: 'Telecel Cash',
      paymentNumber: '0202979378',
      paymentName: 'Paraphrasing X',
      approvedAt: new Date(),
      approvedBy: 'system_auto_approve'
    });

    return NextResponse.json({
      success: true,
      paymentId: payment._id.toString(),
      screenshotPath: `/uploads/payments/${filename}`,
      status: 'approved',
      message: 'Payment screenshot uploaded and verified successfully.',
    });
  } catch (err: any) {
    console.error('Payment upload error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to upload payment screenshot.' },
      { status: 500 }
    );
  }
}
