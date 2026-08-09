import type { Metadata } from 'next'
import HomeClientPage from '@/components/pages/home-client-page'
import { createServerHygraphClient } from '@/lib/hygraph-client'
import { GET_PRODUCTS } from '@/lib/graphql-queries'
import { filterProductsToTShirts } from '@/lib/product-filters'
import type { Product } from '@/lib/types'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export const revalidate = 300

export default async function Home() {
  let products: Product[] = []

  try {
    const client = createServerHygraphClient()
    const data = await client.request<{ products: Product[] }>(GET_PRODUCTS)
    products = filterProductsToTShirts(data.products ?? [])
  } catch (error) {
    console.error('Failed to load homepage products for SEO render:', error)
  }

  return <HomeClientPage initialProducts={products} />
}
