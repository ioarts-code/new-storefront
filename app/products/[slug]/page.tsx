import type { Metadata } from 'next'
import ProductClientPage from '@/components/pages/product-client-page'

type ProductPageProps = {
  params: Promise<{ slug: string }>
}

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
  return <ProductClientPage slug={slug} />
}
