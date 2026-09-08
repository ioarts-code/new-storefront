import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-info'
import { GET_PRODUCTS } from '@/lib/graphql-queries'
import { createServerHygraphClient } from '@/lib/hygraph-client'
import type { Product } from '@/lib/types'

const BASE_URL = SITE_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const urls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
  ]

  try {
    const client = createServerHygraphClient()
    const data = await client.request<{ products: Product[] }>(GET_PRODUCTS)

    urls.push(
      ...(data.products ?? []).map((product) => ({
        url: `${BASE_URL}/products/${product.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    )
  } catch (error) {
    console.error('Failed to load products for sitemap:', error)
  }

  return urls
}
