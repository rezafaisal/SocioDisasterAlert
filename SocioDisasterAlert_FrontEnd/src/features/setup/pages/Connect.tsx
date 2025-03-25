import { Helmet } from "react-helmet-async";
import { CardDashboard } from "@/features/dashboard/pages/CardDashboard";
import Loader3Bar from "../components/Loader";

export const Connect = () => {
  return (
    <div>
      <Helmet>
        <title>Connect</title>
        <meta name="description" content="Koneksi Data set ke media Sossial" />
      </Helmet>
      <CardDashboard title="Koneksi Media Sosial" />
      <Loader3Bar />
    </div>
  );
};
