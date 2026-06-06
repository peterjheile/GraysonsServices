import HeaderClient from "./Header-Client";

import {HEADER_NAV_ITEMS} from "./data"



export default function Header() {

  //Here I will eventually change to retrieve the logo and pass to the client component

  return (
    <HeaderClient navItems={HEADER_NAV_ITEMS}/>
  );
}
