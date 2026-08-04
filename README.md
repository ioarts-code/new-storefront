# Storefront

A product storefront built with **Next.js 16**, **React 19**, and **Hygraph CMS**. Products, categories, and downloadable assets are managed in Hygraph and rendered through a server-side GraphQL proxy that keeps the auth token off the client.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Runtime | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| CMS | Hygraph (GraphQL) |
| Icons | lucide-react |
| Package manager | pnpm |

## Quick Start

```bash
pnpm install
cp envexempel .env.local   # then fill in the values
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

See **[SETUP.md](./SETUP.md)** for the full Hygraph schema and environment configuration.

## Project Structure

```
app/
├─ page.tsx                     Home (hero + product grid)
├─ layout.tsx                   Root layout & metadata
├─ globals.css                  Global styles / design tokens
├─ products/[slug]/page.tsx     Product detail (download + support links)
├─ checkout/                    Checkout page + success page
├─ terms-of-sale/               Static legal page
├─ copyright-attribution/       Static legal page
└─ api/
   ├─ hygraph/route.ts          Server-side GraphQL proxy (hides token)
   └─ checkout/route.ts         Stripe Checkout session endpoint

components/
├─ header.tsx  footer.tsx  hero.tsx  grid.tsx
├─ product-detail.tsx           Product page UI + download handler
├─ checkout-form.tsx
└─ ui/                          shadcn/ui primitives

lib/
├─ types.ts                     Product / Category / Cart types
├─ graphql-queries.ts           GraphQL query definitions
├─ hygraph-client.ts            Browser + server GraphQL clients
└─ cart-context.tsx             Cart state
```

## How Data Flows

1. Components call `createHygraphClient()` which POSTs to `/api/hygraph`.
2. The API route (`app/api/hygraph/route.ts`) forwards the query to Hygraph using the server-only token, so credentials never reach the browser.
3. Server components / route handlers can use `createServerHygraphClient()` to call Hygraph directly.

## Security

- The GraphQL proxy only forwards read queries.

## Deployment

Deploy to Vercel (recommended): push to GitHub and import the repo. Set the environment variables from [SETUP.md](./SETUP.md) in the Vercel project settings.

**Build:** `pnpm build` · **Start:** `pnpm start`
