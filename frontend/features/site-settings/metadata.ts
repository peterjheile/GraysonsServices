import 'server-only';

import type { Metadata } from 'next';

import { getSiteSettings } from './api';
import { fallbackSiteSettings } from './fallback';
import type { SiteSettings } from './types';

function getMetadataBase(): URL {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!siteUrl) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'NEXT_PUBLIC_SITE_URL is required in production',
      );
    }

    return new URL('http://localhost:3000');
  }

  return new URL(siteUrl);
}

const metadataBase = getMetadataBase();

function createSiteMetadata(
  settings: SiteSettings,
): Metadata {
  const title =
    settings.seo_title ||
    settings.business_name;

  const description =
    settings.seo_description ||
    fallbackSiteSettings.seo_description;

  const socialImage =
    settings.social_image_url ||
    fallbackSiteSettings.social_image_url;

  const favicon =
    settings.favicon_url ||
    fallbackSiteSettings.favicon_url;

  return {
    metadataBase,

    title,
    description,

    icons: {
      icon: favicon,
    },

    openGraph: {
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}

export const defaultMetadata = createSiteMetadata(
  fallbackSiteSettings,
);

export async function getSiteMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return createSiteMetadata(settings);
}