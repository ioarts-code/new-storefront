import type { Metadata } from 'next'
import ProductsClientPage from '@/components/pages/products-client-page'

export const metadata: Metadata = {
  title: 'Products | IOARTS',
  description: 'Browse IOARTS products and fanart collections.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/products',
  },
}

export default function ProductsPage() {
  return <ProductsClientPage />
}
