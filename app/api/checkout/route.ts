import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await req.json();
    return NextResponse.json(
      {
        error: 'Checkout API is temporarily disabled.',
      },
      { status: 503 }
    );
  } catch (error) {
    console.error('[checkout] Disabled checkout endpoint error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Checkout is unavailable: ${errorMessage}` },
      { status: 500 }
    );
  }
}
