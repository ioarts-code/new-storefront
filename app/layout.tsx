import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import Footer from '@/components/footer'
import Menu from '@/components/menu'
import TopBar from '@/components/top-bar'
import { CartProvider } from '@/lib/cart-context'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })

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
      className={`${geist.variable} ${geistMono.variable} scroll-smooth`}
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
      <body className="font-sans antialiased bg-[#0F0F0F] text-foreground pt-6 overflow-x-hidden">
        <CartProvider>
          <TopBar />
          <aside className="fixed right-0 top-6 z-50 h-screen w-[58px] sm:w-[64px] lg:w-[58px] pointer-events-none">
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
