import 'server-only';

import { fallbackSiteSettings } from './fallback';
import { siteSettingsSchema, type SiteSettings } from './types';


export async function fetchSiteSettings(): Promise<SiteSettings> {
  const apiUrl = process.env.DJANGO_API_URL;

  if (!apiUrl) {
    throw new Error('DJANGO_API_URL is not configured');
  }

  const response = await fetch(`${apiUrl}/api/site-settings/`, {
    next: {
      revalidate: 300,
      tags: ['site-settings'],
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch SiteSettings: ${response.status} ${response.statusText}`
    );
  }

  const data: unknown = await response.json();
  const result = siteSettingsSchema.safeParse(data);

  if (!result.success) {
    console.error(
      'Invalid SiteSettings response:',
      result.error.issues
    );

    throw new Error('Invalid SiteSettings response');
  }

  return result.data;
}


export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await fetchSiteSettings();
  } catch (error) {
    console.error(
      'Unable to load SiteSettings; using visual fallbacks.',
      error
    );

    return fallbackSiteSettings;
  }
}