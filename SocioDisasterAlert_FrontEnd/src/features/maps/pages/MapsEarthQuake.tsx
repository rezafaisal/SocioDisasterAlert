import { Helmet } from "react-helmet-async";
import { useEarthQuakeMaps } from "../api/getEarthQuakeMaps";
import { Maps } from "../components/Maps";

export const MapsEarthQuake = () => {
  const { data, isLoading, isError } = useEarthQuakeMaps();
  return (
    <>
      <Helmet>
        <title>Gempa</title>
        <meta name="description" content="Maps Gempa Bumi" />
      </Helmet>
      <h1 className="text-4xl font-bold mb-6 font-poppins">
        Bencana Gempa Bumi
      </h1>
      <Maps data={data} isLoading={isLoading} isError={isError} />
    </>
  );
};
