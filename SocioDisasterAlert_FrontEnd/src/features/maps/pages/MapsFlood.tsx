import { Maps } from "../components/Maps";
import { useFloodMaps } from "../api/getFloodMaps";
import { Helmet } from "react-helmet-async";

export const MapsFlood = () => {
  const { data, isLoading, isError } = useFloodMaps();
  return (
    <>
      <Helmet>
        <title>Banjir</title>
        <meta name="description" content="Maps Bencana" />
      </Helmet>
      <h1 className="text-4xl font-bold mb-6 font-poppins">Bencana Banjir</h1>
      <Maps data={data} isLoading={isLoading} isError={isError} />
    </>
  );
};
