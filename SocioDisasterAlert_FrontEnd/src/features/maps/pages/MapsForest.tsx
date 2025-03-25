import { Helmet } from "react-helmet-async";
import { useForestMaps } from "../api/getForestFires";
import { Maps } from "../components/Maps";

export const MapsForest = () => {
  const { data, isLoading, isError } = useForestMaps();
  return (
    <>
      <Helmet>
        <title>Kebakaran Hutan</title>
        <meta name="description" content="Maps Bencana" />
      </Helmet>
      <h1 className="text-4xl font-bold mb-6 font-poppins">
        Bencana Kebakaran Hutan
      </h1>
      <Maps data={data} isLoading={isLoading} isError={isError} />
    </>
  );
};
