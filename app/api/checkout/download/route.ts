import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { GET_PRODUCTS_BY_IDS } from '@/lib/graphql-queries';
import { createServerHygraphClient } from '@/lib/hygraph-client';
import type { Product } from '@/lib/types';

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

    const productIds = session.metadata?.productIds
      ?.split(',')
      .map((id) => id.trim())
      .filter(Boolean) ?? [];

    if (productIds.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const client = createServerHygraphClient();
    const data = await client.request<{ products: Product[] }>(GET_PRODUCTS_BY_IDS, {
      ids: productIds,
    });

    const products = (data.products ?? [])
      .filter((product) => product.productType === 'digitalProduct' && product.download?.url)
      .map((product) => ({
        id: product.id,
        name: product.name,
        download: product.download,
      }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error('[checkout/download] Failed to load paid products:', error);
    return NextResponse.json(
      { error: 'Unable to load your downloads' },
      { status: 500 }
    );
  }
}