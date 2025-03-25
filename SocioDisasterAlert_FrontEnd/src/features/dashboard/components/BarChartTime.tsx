import { BarChart } from "@mantine/charts";
import { useTotalDisaster } from "../api/getTotalDisaster";
import { Center, Loader } from "@mantine/core";
import React from "react";

type props = {
  year?: string;
};

export const BarChartTime: React.FC<props> = ({ year }: props) => {
  const {
    data: total,
    isError,
    isLoading,
  } = useTotalDisaster({ params: { year } });

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
      dataKey="month_short"
      withYAxis={true}
      withXAxis={true}
      series={[{ name: "bencana" }]}
    />
  );
};
