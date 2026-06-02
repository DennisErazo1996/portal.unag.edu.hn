export type NavLink = {
  type: 'link';
  label: string;
  href: string;
  target?: string;
  icon?: string;
};

export type NavGroup = {
  type: 'group';
  title: string;
  children: NavLink[];
};

export type NavDropdown = {
  type: 'dropdown';
  label: string;
  icon?: string;
  children: (NavLink | NavGroup)[];
};

export type NavCarreras = {
  type: 'carreras';
  label: string;
  icon?: string;
};

export type NavItem = NavLink | NavDropdown | NavCarreras;
