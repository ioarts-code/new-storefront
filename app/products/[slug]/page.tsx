import type { Metadata } from 'next'
import ProductClientPage from '@/components/pages/product-client-page'
import { createServerHygraphClient } from '@/lib/hygraph-client'
import { GET_PRODUCT_BY_SLUG } from '@/lib/graphql-queries'
import type { Product } from '@/lib/types'

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params

  return {
    title: `Product | ${slug} | IOARTS`,
    alternates: {
      canonical: `/products/${slug}`,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  let product: Product | null = null

  try {
    const client = createServerHygraphClient()
    const data = await client.request<{ products: Product[] }>(GET_PRODUCT_BY_SLUG, { slug })
    product = data.products?.[0] ?? null
  } catch (error) {
    console.error(`Failed to load product data for ${slug}:`, error)
  }

  return <ProductClientPage slug={slug} product={product} />
}
