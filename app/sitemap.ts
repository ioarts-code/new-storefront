import type { MetadataRoute } from 'next'
import { createServerHygraphClient } from '@/lib/hygraph-client'

const BASE_URL = 'https://www.ioarts.ink'

type ProductSlugResult = {
  products: Array<{ slug: string }>
}

const GET_PRODUCT_SLUGS = /* GraphQL */ `
  query GetProductSlugs {
    products(first: 500) {
      slug
    }
  }
`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms-of-sale`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/copyright-attribution`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    const client = createServerHygraphClient()
    const data = await client.request<ProductSlugResult>(GET_PRODUCT_SLUGS)

    const productRoutes: MetadataRoute.Sitemap = (data.products || [])
      .filter((product) => Boolean(product.slug))
      .map((product) => ({
        url: `${BASE_URL}/products/${product.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    return [...staticRoutes, ...productRoutes]
  } catch {
    // Keep sitemap available even if CMS is temporarily unreachable.
    return staticRoutes
  }
}