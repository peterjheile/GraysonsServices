import { getSiteSettings } from '@/features/site-settings/api';

import HeaderClient from "./Header-Client";
import {NAV_ITEMS} from "./view-data"



export default async function Header() {
  const settings = await getSiteSettings();

  return (
    <HeaderClient
      navItems={NAV_ITEMS}
      logoUrl={settings.logo_url}
    />
  );
}
