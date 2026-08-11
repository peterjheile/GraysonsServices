import 'server-only';

import { fetchApi } from '@/lib/api/server';

import { fallbackSiteSettings } from './fallback';
import {
  siteSettingsSchema,
  type SiteSettings,
} from './types';

const SITE_SETTINGS_CACHE = {
  revalidate: 300,
  tags: ['site-settings'],
} as const;

export async function fetchSiteSettings(): Promise<SiteSettings> {
  return fetchApi(
    '/api/site-settings/',
    siteSettingsSchema,
    SITE_SETTINGS_CACHE,
  );
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await fetchSiteSettings();
  } catch (error) {
    console.error(
      'Unable to load SiteSettings; using visual fallbacks.',
      error,
    );

    return fallbackSiteSettings;
  }
}