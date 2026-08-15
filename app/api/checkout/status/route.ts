import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing Stripe session ID' }, { status: 400 });
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Missing STRIPE_SECRET_KEY environment variable' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'This checkout has not been paid' }, { status: 403 });
    }

    return NextResponse.json({
      paid: true,
      hasPhysicalProduct: session.metadata?.hasPhysicalProduct === 'true',
    });
  } catch (error) {
    console.error('[checkout/status] Failed to verify paid session:', error);
    return NextResponse.json(
      { error: 'Unable to verify your payment' },
      { status: 500 }
    );
  }
}