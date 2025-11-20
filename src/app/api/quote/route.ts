import { NextRequest, NextResponse } from 'next/server';
import { QuoteFormSchema } from '@/lib/schemas/quote';
import { sendQuoteEmail } from '@/lib/email';

// Simple in-memory rate limiting
interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

function simpleRateLimit(
  identifier: string,
  limit: number = 3,
  windowMs: number = 3600000 // 1 hour
): boolean {
  const now = Date.now();
  const entry = store[identifier];

  if (!entry || now > entry.resetTime) {
    store[identifier] = { count: 1, resetTime: now + windowMs };
    return true;
  }

  if (entry.count < limit) {
    entry.count++;
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (3 requests per hour per IP)
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';
    
    if (!simpleRateLimit(ip, 3, 3600000)) {
      return NextResponse.json(
        { 
          error: 'Trop de demandes. Veuillez réessayer dans une heure.',
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    const validation = QuoteFormSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation échouée',
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Send email
    await sendQuoteEmail(validation.data);

    return NextResponse.json(
      { success: true, message: 'Demande de devis envoyée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Quote form error:', error);
    
    return NextResponse.json(
      { error: 'Échec de l\'envoi. Veuillez réessayer plus tard.' },
      { status: 500 }
    );
  }
}
