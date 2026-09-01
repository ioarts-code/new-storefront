import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-info'

const BASE_URL = SITE_URL

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
  ]
}
