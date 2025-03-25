import { Icon } from "@tabler/icons-react";

export type UserRole = "Admin" | "Customer";

export type SidebarRoute = {
  title: string;
  icon?: Icon | React.FC<React.ComponentProps<"svg">>;
  href?: string;
  routes?: SidebarRoute[];
  role?: Array<UserRole | `-${UserRole}`>;
};

export type SidebarSection = {
  title?: string;
  routes: SidebarRoute[];
  role?: Array<UserRole | `-${UserRole}`>;
};

export type SidebarNavigation = SidebarSection[];

export type Metadata = {
  page: number;
  limit: number;
  total: number;
  count: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};
