import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Read env vars inside the handler so they are always fresh after a reload.
  // Endpoint can be public for temporary keyless mode.
  const ENDPOINT =
    process.env.HYGRAPH_ENDPOINT || process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
  const AUTH_TOKEN =
    process.env.HYGRAPH_AUTH_TOKEN || process.env.NEXT_PUBLIC_HYGRAPH_AUTH_TOKEN;

  // Log environment for debugging (occasionally to avoid spam).
  if (Math.random() < 0.05) {
    console.log('[API] Hygraph config check:', {
      endpoint: ENDPOINT ? 'set' : 'missing',
      authToken: AUTH_TOKEN ? 'set' : 'not set',
    });
  }

  try {
    if (!ENDPOINT) {
      const error = 'Hygraph configuration missing. Set NEXT_PUBLIC_HYGRAPH_ENDPOINT env var.';
      console.error('[API]', error);
      return NextResponse.json(
        { errors: [{ message: error }] },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Request body must be an object.' }, { status: 400 });
    }

    const { query, variables } = body as Record<string, unknown>;

    // Basic validation — query must be a non-empty string.
    if (typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json(
        { error: 'A non-empty "query" string is required.' },
        { status: 400 }
      );
    }

    // Only allow read (query) operations — no mutations via this proxy.
    const trimmed = query.trim().toLowerCase();
    if (!trimmed.startsWith('query')) {
      return NextResponse.json(
        { error: 'Only read queries are permitted via this endpoint.' },
        { status: 403 }
      );
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (AUTH_TOKEN) {
      headers.Authorization = `Bearer ${AUTH_TOKEN}`;
    }

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    // Read response body once.
    const responseBody = await response.text();

    let data: any;
    try {
      data = responseBody ? JSON.parse(responseBody) : {};
    } catch {
      console.error('[API] Failed to parse Hygraph response:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type') || 'unknown',
        body: responseBody.slice(0, 500), // First 500 chars
        endpoint: ENDPOINT,
      });
      const errorMsg = `Hygraph returned invalid JSON (status ${response.status}): ${responseBody.slice(0, 200)}`;
      return NextResponse.json(
        { errors: [{ message: errorMsg }] },
        { status: response.status || 500 }
      );
    }

    if (!response.ok) {
      const upstreamMessage = data?.errors?.[0]?.message || data?.error || data?.message || null;
      const fallbackMessage = responseBody
        ? `HTTP ${response.status}: ${responseBody.slice(0, 200)}`
        : `HTTP ${response.status} ${response.statusText}`;

      console.error('[API] Hygraph returned error status:', {
        status: response.status,
        statusText: response.statusText,
        data,
        endpoint: ENDPOINT,
      });

      // Ensure we always return a GraphQL-style error payload.
      const errors = data?.errors || [{ message: upstreamMessage || fallbackMessage }];
      return NextResponse.json(
        { errors: Array.isArray(errors) ? errors : [{ message: String(errors) }] },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Hygraph request failed: ${message}` },
      { status: 500 }
    );
  }
}
