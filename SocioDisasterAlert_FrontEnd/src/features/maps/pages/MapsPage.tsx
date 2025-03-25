import { CardDashboard } from "@/features/dashboard/pages/CardDashboard";
import { Maps } from "../components/Maps";
import { useMaps } from "../api/getMaps";
import { Helmet } from "react-helmet-async";

export const MapsPage = () => {
  const { data, isLoading, isError } = useMaps();
  return (
    <>
      <Helmet>
        <title>Maps</title>
        <meta name="description" content="Chart Bencana" />
      </Helmet>
      <CardDashboard title="Maps" />
      <Maps data={data} isLoading={isLoading} isError={isError} />
    </>
  );
};
