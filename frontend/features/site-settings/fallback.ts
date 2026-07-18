import type { SiteSettings } from './types';

export const fallbackSiteSettings: SiteSettings = {
  business_name: "Grayson's Services",
  tagline: '',

  logo_url: '/images/fallbacks/logo.png',
  favicon_url: '/favicon.png',

  phone: '',
  email: '',

  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  zip_code: '',
  service_area: '',

  facebook_url: '',
  instagram_url: '',
  google_business_url: '',
  linkedin_url: '',

  seo_title: "Grayson's Services",
  seo_description: 'Professional property services in Bloomington, Indiana.',
  social_image_url: '/images/fallbacks/social-image.jpeg',

  business_hours: [],
  updated_at: new Date(0).toISOString(),
};