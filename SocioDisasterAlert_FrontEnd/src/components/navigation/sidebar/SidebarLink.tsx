import { IconStack2 } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";

import { SidebarRoute } from "@/types/navigation";

import styles from "./Sidebar.module.css";

export const SidebarLink: React.FC<SidebarRoute> = ({ href, title, icon }) => {
  const { pathname } = useLocation();
  const Icon = icon ?? IconStack2;
  const paths = pathname.split("/");

  const active = href == "/" ? pathname == href : `/${paths[1]}` == href;

  return (
    <div className="relative">
      <Link
        to={href ?? "/"}
        className={`${styles["sidebar-link"]} ${
          active && styles["sidebar-link-active"]
        }`}
      >
        {Icon && (
          <Icon color="gray" className="w-4 h-4 shrink-0 leading-none" />
        )}
        <span className="ml-3 text-gray-500 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
          {title}
        </span>
      </Link>
    </div>
  );
};
