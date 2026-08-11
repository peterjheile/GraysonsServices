export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS = [
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '/careers' },
] satisfies readonly NavItem[];

export const FOOTER_SUMMARY =
  'Dependable commercial and residential services delivered with skilled workmanship, careful attention to detail, and results built to last.';