import type { MetadataRoute } from 'next';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://graysonsservices.com'
).replace(/\/$/, '');

const LAST_MODIFIED = {
  home: '2026-08-29',
  services: '2026-08-29',
  projects: '2026-08-29',
  testimonials: '2026-08-29',
  contact: '2026-08-29',
  careers: '2026-08-29',
  privacy: '2026-08-29',
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED.home,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: LAST_MODIFIED.services,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: LAST_MODIFIED.projects,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/testimonials`,
      lastModified: LAST_MODIFIED.testimonials,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: LAST_MODIFIED.contact,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/careers`,
      lastModified: LAST_MODIFIED.careers,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: LAST_MODIFIED.privacy,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}