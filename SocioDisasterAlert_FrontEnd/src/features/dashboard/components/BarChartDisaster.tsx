import { BarChart } from "@mantine/charts";
import { useDisaster } from "../api/getDisaster";
import { Center, Loader } from "@mantine/core";

type props = {
  year?: string;
};
export const BarChartDisaster = ({ year }: props) => {
  const { data, isError, isLoading } = useDisaster({ params: { year } });

  if (isLoading) {
    return (
      <Center>
        <Loader type="dots" />
      </Center>
    );
  }

  if (isError || !data) {
    return <div>Tidak Tersedia</div>;
  }
  return (
    <BarChart
      h={300}
      data={data.data}
      dataKey="month"
      withLegend
      withYAxis={true}
      withXAxis={true}
      series={[
        { name: "gempa_bumi" },
        { name: "banjir", color: "gray.4" },
        { name: "kebakaran_hutan", color: "lime.2" },
      ]}
    />
  );
};
