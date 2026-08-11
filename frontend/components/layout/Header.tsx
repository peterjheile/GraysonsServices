import { getSiteSettings } from '@/features/site-settings/api';

import HeaderClient from './Header-Client';
import { NAV_ITEMS } from './view-data';

export default async function Header() {
  const settings = await getSiteSettings();

  const phone = settings.phone?.trim() || null;
  const phoneHref = phone
    ? `tel:${phone.replace(/[^\d+]/g, '')}`
    : null;

  return (
    <HeaderClient
      navItems={NAV_ITEMS}
      logoUrl={settings.logo_url}
      businessName={settings.business_name}
      phone={phone}
      phoneHref={phoneHref}
    />
  );
}