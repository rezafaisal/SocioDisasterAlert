import { Button, UnstyledButton } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";

import { UserMenu } from "./UserMenu";
import { Authorization } from "@/features/auth/components/Authorization";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  function toggleSidebar() {
    const isExpanded = document.body.classList.contains("sidebar-expanded");
    if (isExpanded) {
      return document.body.classList.remove("sidebar-expanded");
    }

    document.body.classList.add("sidebar-expanded");
  }

  return (
    <header className="sticky bg-white shadow top-0 z-20 w-full">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex">
            <UnstyledButton
              id="header"
              className="text-gray-600 hover:text-gray-700 transition-colors lg:hidden"
              aria-controls="sidebar"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <IconMenu2 className="w-6 h-6 fill-current" />
            </UnstyledButton>
          </div>
          <Authorization role={["Admin", "Customer"]}>
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </Authorization>
          <Authorization role={["-Admin", "-Customer"]}>
            <div className="flex items-center space-x-4">
              <Button onClick={() => navigate("/login")}>Login</Button>
            </div>
          </Authorization>
        </div>
      </div>
    </header>
  );
};
