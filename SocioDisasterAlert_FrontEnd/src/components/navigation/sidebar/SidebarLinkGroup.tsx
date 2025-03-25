import { IconChevronRight, IconStack2 } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarRoute } from "@/types/navigation";
import { clsx } from "@/utils/format";

import styles from "./Sidebar.module.css";
import { useAuth } from "@/features/auth/hooks";

export const SidebarLinkGroup: React.FC<SidebarRoute> = ({
  title,
  icon,
  routes,
}) => {
  const accordion = useRef<HTMLUListElement>(null);
  const { pathname } = useLocation();
  const activeRoutes = routes
    ?.filter(({ href }) => new RegExp(`^${href}(?:/|$)`).test(pathname))
    .map(({ href }) => href);
  const [collapsed, setCollapsed] = useState(activeRoutes?.length != 0);
  const Icon = icon ?? IconStack2;
  const { isPermitted } = useAuth();
  function toggleSidebar() {
    const isExpanded = document
      .querySelector("body")
      ?.classList.contains("sidebar-expanded");
    if (isExpanded) {
      return;
    }

    document.body.classList.add("sidebar-expanded");
  }

  function toggle() {
    if (!collapsed) {
      toggleSidebar();
    }

    setCollapsed(!collapsed);
  }

  useEffect(() => {
    const element = accordion.current;
    if (!element) return;

    if (!collapsed) {
      element.style.maxHeight = "0";
    } else {
      element.style.maxHeight = `${element?.scrollHeight}px`;
    }
  }, [collapsed]);

  return (
    <div className="relative">
      <button
        aria-hidden
        onClick={toggle}
        className={clsx(
          styles["sidebar-link"],
          activeRoutes?.length != 0
            ? styles["sidebar-link-active"]
            : collapsed
            ? styles["sidebar-link-collapsed"]
            : "",
          "w-full justify-between cursor-pointer"
        )}
      >
        <div className="flex items-center">
          {Icon && (
            <Icon color="gray" className="w-4 h-4 shrink-0 leading-none" />
          )}
          <span className="ml-3 lg:opacity-0 text-gray-500 lg:sidebar-expanded:opacity-100 2xl:opacity-100 transition duration-200">
            {title}
          </span>
        </div>
        <div className="flex shrink-0 ml-2">
          <IconChevronRight
            className={`w-3 h-3 duration-300 shrink-0 ml-1 transition ${
              collapsed && "rotate-90"
            }`}
          />
        </div>
      </button>
      <ul
        ref={accordion}
        className="overflow-hidden p-0 m-0 list-none transition-all ease-out duration-300 h-0 2xl:h-full sidebar-expanded:!h-full max-h-0 -mb-0.5"
      >
        {routes
          ?.filter(({ role }) => (role ? isPermitted(role) : true))
          .map(({ title, href }, i) => (
            <li key={`title_${i}`} className="last:mb-1 text-gray-500">
              <Link
                to={href ?? "/"}
                className="hover:text-gray-700 w-full font-normal text-sm px-6 py-2.5 rounded mb-0.5 last:mb-0 hover:bg-gray-50 hover:bg-opacity-80 transition duration-150 truncate flex items-center"
              >
                <div className="w-5 h-5 shrink-0 leading-none flex items-center justify-center">
                  <div
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full",
                      activeRoutes?.includes(href)
                        ? "ring-2 bg-primary-400 ring-primary-200"
                        : "bg-gray-300"
                    )}
                  ></div>
                </div>
                <span className="ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  {title}
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};
