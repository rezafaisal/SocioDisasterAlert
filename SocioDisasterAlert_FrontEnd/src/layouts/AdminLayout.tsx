import { Sidebar } from "@/components/navigation/sidebar/Sidebar";
import { useAuth } from "@/features/auth/hooks";
import { SidebarNavigation } from "@/types/navigation";
import { Center, Loader } from "@mantine/core";
import {
  IconBrandX,
  IconGlobe,
  IconGraph,
  IconKey,
  IconMap2,
  IconMapSearch,
  IconMapShare,
  IconPlugConnected,
  IconRadioactive,
  IconUser,
} from "@tabler/icons-react";
import { Navigate, Outlet } from "react-router-dom";
import { Header } from "./components/DashboardLayout/Header";
import { Suspense } from "react";

export const AdminLayout = () => {
  const navigations: SidebarNavigation = [
    {
      title: "MENU",
      routes: [
        {
          title: "Dashboard",
          href: "/",
          icon: IconGraph,
        },
        {
          title: "Maps",
          href: "/maps",
          icon: IconMapSearch,
        },
        {
          title: "Bencana",
          icon: IconRadioactive,
          routes: [
            {
              title: "Banjir",
              href: "/maps/banjir",
            },
            {
              title: "Gempa",
              href: "/maps/gempa",
            },
            {
              title: "Kebakaran Hutan",
              href: "/maps/kebakaranHutan",
            },
          ],
        },
      ],
    },
    {
      title: "DATA MASTER",
      role: ["Admin"],
      routes: [
        {
          title: "Tweet",
          href: "/tweet",
          icon: IconBrandX,
          role: ["Admin"],
        },
        { title: "User", href: "/user", icon: IconUser, role: ["Admin"] },
      ],
    },
    {
      title: "SETUP",
      role: ["Admin"],
      routes: [
        {
          title: "Provinsi",
          href: "/provinsi",
          icon: IconGlobe,
          role: ["Admin"],
        },
        {
          title: "Kabupaten",
          href: "/kabupaten",
          icon: IconMapShare,
          role: ["Admin"],
        },
        {
          title: "Distrik",
          href: "/distrik",
          icon: IconMap2,
          role: ["Admin"],
        },

        {
          title: "Kata Kunci",
          href: "/keywords",
          icon: IconKey,
          role: ["Admin"],
        },
        {
          title: "Koneksi X",
          href: "/connect",
          icon: IconPlugConnected,
          role: ["Admin"],
        },
      ],
    },
  ];

  const LoadingScreen = () => (
    <Center className="w-full h-full bg-body">
      <Loader type="dots" />
    </Center>
  );
  const { creds } = useAuth();
  if (creds?.role === "Customer" || !creds)
    return <Navigate to="/login" replace />;
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar navigations={navigations} />

      <div
        className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden pb-12"
        id="content"
      >
        <Header />
        <Suspense fallback={<LoadingScreen />}>
          <div className="px-4 sm:px-6 lg:px-8 py-8 pb-14 w-full max-w-8xl mx-auto">
            <Outlet />
          </div>
        </Suspense>
      </div>
    </div>
  );
};
