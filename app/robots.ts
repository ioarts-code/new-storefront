import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-info'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/cart', '/checkout', '/downloads/*.svg$'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}