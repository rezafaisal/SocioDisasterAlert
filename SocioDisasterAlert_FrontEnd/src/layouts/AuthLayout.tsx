import { useAuth } from "@/features/auth/hooks";
import { Navigate, Outlet } from "react-router-dom";

export const AuthLayout = () => {
  const { creds } = useAuth();
  if (creds) return <Navigate to="/" replace />;
  return (
    <main>
      <div className="flex justify-center items-center min-h-screen">
        <Outlet />
      </div>
    </main>
  );
};
