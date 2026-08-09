/**
 * Hygraph GraphQL client — routes all requests through the server-side API
 * proxy (/api/hygraph) so that the auth token is never exposed to the browser.
 *
 * For server components / Route Handlers use createServerHygraphClient()
 * which calls Hygraph directly with the server-only token.
 */

// ---------------------------------------------------------------------------
// Browser-safe client — talks to our own Next.js API route
// ---------------------------------------------------------------------------
export function createHygraphClient() {
  return {
    request: async <T,>(query: string, variables?: Record<string, any>): Promise<T> => {
      // Relative URLs don't work during SSR — build an absolute URL.
      // In the browser, window.location.origin gives the correct origin.
      // On the server (SSR), fall back to the NEXT_PUBLIC_APP_URL env var,
      // then localhost:3000 for local dev.
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      const endpoint = `${origin}/api/hygraph`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });

      const responseText = await response.text();
      let data: any = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = { raw: responseText };
        }
      }

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || 'unknown';
        const errorMessage =
          data?.errors?.[0]?.message ||
          data?.error ||
          data?.message ||
          (responseText ? `HTTP ${response.status}: ${responseText.slice(0, 200)}` : `API request failed with status ${response.status}`);

        console.error('[v0] GraphQL error response:', data);
        console.error('[v0] Error details:', {
          status: response.status,
          statusText: response.statusText,
          endpoint,
          contentType,
          errorMessage,
        });

        throw new Error(`GraphQL request failed (${response.status}): ${errorMessage}`);
      }

      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'GraphQL error');
      }
      if (data.error) {
        throw new Error(data.error);
      }

      return data.data;
    },
  };
}

// ---------------------------------------------------------------------------
// Server-only client — used in Route Handlers & Server Components
// Uses direct endpoint requests without API key headers in temporary keyless mode.
// ---------------------------------------------------------------------------
export function createServerHygraphClient() {
  return {
    request: async <T,>(query: string, variables?: Record<string, any>): Promise<T> => {
      // Prefer private server endpoint var, then public endpoint env var.
      const endpoint =
        process.env.HYGRAPH_ENDPOINT || process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;

      if (!endpoint) {
        throw new Error('Hygraph endpoint must be configured');
      }

      const authToken =
        process.env.HYGRAPH_AUTH_TOKEN || process.env.NEXT_PUBLIC_HYGRAPH_AUTH_TOKEN;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API request failed with status ${response.status}${errorText ? `: ${errorText.slice(0, 200)}` : ''}`
        );
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'GraphQL error');
      }

      return data.data;
    },
  };
}
