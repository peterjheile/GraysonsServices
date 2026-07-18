import 'server-only';

import type { Metadata } from 'next';

import { fetchSiteSettings } from './api';

const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
);

const defaultTitle = "Grayson's Services";
const defaultDescription = "Grayson's Services provides professional property services in Bloomington, Indiana.";
const defaultSocialImage = '/images/fallbacks/social-image.jpg';
const defaultFavicon = '/favicon.ico';

export const defaultMetadata: Metadata = {
  metadataBase,

  title: defaultTitle,
  description: defaultDescription,

  icons: {
    icon: defaultFavicon,
  },

  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultSocialImage],
  },

  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultSocialImage],
  },
};

export async function getSiteMetadata(): Promise<Metadata> {
  try {
    const settings = await fetchSiteSettings();

    const title = settings.seo_title || settings.business_name;
    const description = settings.seo_description || defaultDescription;
    const socialImage = settings.social_image_url || defaultSocialImage;
    const favicon = settings.favicon_url || defaultFavicon;

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
        images: [socialImage],
      },

      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [socialImage],
      },
    };
  } catch (error) {
    console.error(
      'Unable to generate dynamic metadata; using static defaults.',
      error
    );

    return defaultMetadata;
  }
}