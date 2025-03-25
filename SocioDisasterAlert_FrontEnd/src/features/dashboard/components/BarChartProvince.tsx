import { BarChart } from "@mantine/charts";
import { Center, Loader } from "@mantine/core";
import React from "react";
import { useDisasterProvince } from "../api/getProvinceDisaster";

type props = {
  year?: string;
};

export const BarChartProvince: React.FC<props> = ({ year }: props) => {
  const {
    data: total,
    isError,
    isLoading,
  } = useDisasterProvince({ params: { year } });

  if (isLoading) {
    return (
      <Center>
        <Loader type="dots" />
      </Center>
    );
  }

  if (isError) {
    return <div>Tidak Tersedia</div>;
  }

  return (
    <BarChart
      h={300}
      data={total.data}
      dataKey="province_name"
      withYAxis={true}
      withXAxis={true}
      series={[{ name: "total_bencana" }]}
    />
  );
};
