import type { MetadataRoute } from 'next'
import { createServerHygraphClient } from '@/lib/hygraph-client'
import { SITE_URL } from '@/lib/site-info'

const BASE_URL = SITE_URL
const MAX_PRODUCTS_PER_PAGE = 500

type ProductSlugResult = {
  products: Array<{ slug: string }>
}

const GET_PRODUCT_SLUGS = /* GraphQL */ `
  query GetProductSlugs($first: Int!, $skip: Int!) {
    products(first: $first, skip: $skip) {
      slug
    }
  }
`

async function getAllProductSlugs() {
  const client = createServerHygraphClient()
  const allProducts: Array<{ slug: string }> = []
  let skip = 0

  while (true) {
    const data = await client.request<ProductSlugResult>(GET_PRODUCT_SLUGS, {
      first: MAX_PRODUCTS_PER_PAGE,
      skip,
    })

    const batch = data.products || []
    allProducts.push(...batch.filter((product) => Boolean(product.slug)))

    if (batch.length < MAX_PRODUCTS_PER_PAGE) {
      break
    }

    skip += MAX_PRODUCTS_PER_PAGE
  }

  return allProducts
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/terms-of-sale`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/copyright-attribution`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  try {
    const products = await getAllProductSlugs()

    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}
