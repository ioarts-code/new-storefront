import type { Metadata } from 'next'
import HomeClientPage from '@/components/pages/home-client-page'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return <HomeClientPage />
}
