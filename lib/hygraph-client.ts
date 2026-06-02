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

      const response = await fetch(`${origin}/api/hygraph`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `HTTP ${response.status} - Could not parse error response` };
        }
        
        const errorMessage = 
          errorData?.errors?.[0]?.message || 
          errorData?.error || 
          errorData?.message || 
          `API request failed with status ${response.status}`;
        
        console.error('[v0] GraphQL error response:', errorData);
        console.error('[v0] Error details:', {
          status: response.status,
          statusText: response.statusText,
          endpoint: origin + '/api/hygraph',
          errorMessage,
          fullResponse: JSON.stringify(errorData),
        });
        
        throw new Error(`GraphQL request failed: ${errorMessage}`);
      }

      const data = await response.json();

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
// Uses HYGRAPH_AUTH_TOKEN (no NEXT_PUBLIC_ prefix) so it never reaches the browser.
// ---------------------------------------------------------------------------
export function createServerHygraphClient() {
  return {
    request: async <T,>(query: string, variables?: Record<string, any>): Promise<T> => {
      // Prefer the private server-side token; fall back to the public endpoint env var.
      const endpoint =
        process.env.HYGRAPH_ENDPOINT || process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
      const token =
        process.env.HYGRAPH_AUTH_TOKEN || process.env.NEXT_PUBLIC_HYGRAPH_AUTH_TOKEN;

      if (!endpoint) {
        throw new Error('Hygraph endpoint must be configured');
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'GraphQL error');
      }

      return data.data;
    },
  };
}
