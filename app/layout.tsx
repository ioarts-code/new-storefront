import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import { Inter, Mr_Dafoe } from 'next/font/google'
import Footer from '@/components/footer'
import Menu from '@/components/menu'
import { CartProvider } from '@/lib/cart-context'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const mrDafoe = Mr_Dafoe({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-mr-dafoe',
})

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'IOARTS',
  description: 'Digital Arts Fanart & Illustrations',
  url: 'https://www.ioarts.ink',
  logo: 'https://www.ioarts.ink/favicon.svg',
  sameAs: [
    'https://www.deviantart.com',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SE',
  },
}

export const metadata: Metadata = {
  title: 'IOARTS | Digital Art Fanart & Illustration Gallery',
  description: 'Discover unique digital art Fanart and illustrations. Official IOARTS Gallery featuring exclusive illustrated arts',
  keywords: ['digital art', 'Fanart', 'illustrations', 'art Gallery', 'exclusive designs'],
  authors: [{ name: 'Anders Altmann' }],
  creator: 'Anders Altmann',
  publisher: 'IOARTS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ioarts.ink',
    siteName: 'IOARTS',
    title: 'IOARTS | Digital Art Fanart & Illustration Gallery',
    description: 'Discover unique digital art Fanart and illustrations. Official IOARTS Gallery featuring exclusive illustrated arts',
    images: [
      {
        url: '/favicon.svg',
        width: 219,
        height: 226,
        alt: 'IOARTS Logo',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IOARTS | Digital Art Fanart & Illustration Gallery',
    description: 'Discover unique digital art Fanart and illustrations.',
    creator: '@ioarts',
    images: ['/favicon.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://www.ioarts.ink',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
    >
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#0F0F0F" />
        <link rel="canonical" href="https://www.ioarts.ink" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          suppressHydrationWarning
        />
      </head>
      <body className={`${inter.variable} ${mrDafoe.variable} ${inter.className} antialiased bg-[#0F0F0F] text-foreground overflow-x-hidden`}>
        <CartProvider>
          <aside className="fixed right-0 top-0 z-50 h-screen w-[58px] sm:w-[64px] lg:w-[58px] pointer-events-none">
            <Suspense fallback={null}>
              <Menu />
            </Suspense>
          </aside>
          {children}
          <Footer />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </CartProvider>
      </body>
    </html>
  )
}
