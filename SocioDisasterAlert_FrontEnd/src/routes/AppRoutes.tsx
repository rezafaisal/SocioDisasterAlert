import { AuthLayout } from "@/layouts/AuthLayout";
import { GeneralLayout } from "@/layouts/GeneralLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { lazyImport } from "@/utils/lazyImport";
import { UnderDevelopment } from "@/components/underdevelopment/UnderDevelopment";
import { CenterLoader } from "@/components/CenterLoader";

const { Login } = lazyImport(
  () => import("@/features/auth/pages/Login"),
  "Login"
);
const { DashboardChart } = lazyImport(
  () => import("@/features/dashboard/pages/DashboardChart"),
  "DashboardChart"
);
const { MapsEarthQuake } = lazyImport(
  () => import("@/features/maps/pages/MapsEarthQuake"),
  "MapsEarthQuake"
);
const { MapsFlood } = lazyImport(
  () => import("@/features/maps/pages/MapsFlood"),
  "MapsFlood"
);
const { MapsForest } = lazyImport(
  () => import("@/features/maps/pages/MapsForest"),
  "MapsForest"
);
const { MapsPage } = lazyImport(
  () => import("@/features/maps/pages/MapsPage"),
  "MapsPage"
);
const { Connect } = lazyImport(
  () => import("@/features/setup/pages/Connect"),
  "Connect"
);
const { Districts } = lazyImport(
  () => import("@/features/setup/pages/Districts"),
  "Districts"
);
const { Keywords } = lazyImport(
  () => import("@/features/setup/pages/Keywords"),
  "Keywords"
);
const { Provinces } = lazyImport(
  () => import("@/features/setup/pages/Province"),
  "Provinces"
);
const { Regencies } = lazyImport(
  () => import("@/features/setup/pages/Regencies"),
  "Regencies"
);
const { Tweets } = lazyImport(
  () => import("@/features/setup/pages/Tweet"),
  "Tweets"
);
const { Users } = lazyImport(
  () => import("@/features/setup/pages/User"),
  "Users"
);

//const { Home } = lazyImport(() => import("./Home"), "Home");

export const AppRoutes = () => {
  return (
    <Suspense fallback={<CenterLoader />}>
      <Routes>
        <Route element={<GeneralLayout />}>
          <Route path="/maps" element={<MapsPage />} />
          <Route path="/maps/banjir" element={<MapsFlood />} />
          <Route path="/maps/gempa" element={<MapsEarthQuake />} />
          <Route path="/maps/kebakaranHutan" element={<MapsForest />} />
          <Route path="/" element={<DashboardChart />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/provinsi" element={<Provinces />} />
          <Route path="/kabupaten" element={<Regencies />} />
          <Route path="/distrik" element={<Districts />} />
          <Route path="/tweet" element={<Tweets />} />
          <Route path="/user" element={<Users />} />
          <Route path="/keywords" element={<Keywords />} />
          <Route path="/connect" element={<Connect />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="*" element={<UnderDevelopment />} />
      </Routes>
    </Suspense>
  );
};
