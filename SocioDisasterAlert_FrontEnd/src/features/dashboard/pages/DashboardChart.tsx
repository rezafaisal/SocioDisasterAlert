import { Card, Select, SimpleGrid } from "@mantine/core";
import { BarChartDisaster } from "../components/BarChartDisaster";
import { CardDashboard } from "./CardDashboard";
import { BarChartTime } from "../components/BarChartTime";
import { QueryTotalDisaster } from "../api/getTotalDisaster";
import { useState } from "react";
import { years } from "@/features/setup/types";
import { Helmet } from "react-helmet-async";
import { BarChartProvince } from "../components/BarChartProvince";
import { QueryDisasterProvince } from "../api/getProvinceDisaster";

export const DashboardChart = () => {
  const [queryTime, setQuery] = useState<QueryTotalDisaster>({
    year: "",
  });
  const [queryDisaster, setQueryDisaster] = useState<QueryTotalDisaster>({
    year: "",
  });
  const [queryProvince, setQueryProvince] = useState<QueryDisasterProvince>({
    year: "",
  });
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Chart Bencana" />
      </Helmet>
      <CardDashboard title="Dashboard" />
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="flex gap-5 mb-5">
            <h2 className="text-black font-semibold text-2xl">Waktu</h2>
            <Select
              placeholder="Pilih Tahun"
              value={queryTime.year}
              data={years}
              defaultValue={"2024"}
              clearable
              onChange={(v) => setQuery({ ...queryTime, year: v ?? "" })}
            />
          </div>
          <BarChartTime year={queryTime.year} />
        </Card>
        <Card>
          <div className="flex gap-5 mb-5">
            <h2 className="text-black font-semibold text-2xl">Bencana</h2>
            <Select
              placeholder="Pilih Tahun"
              value={queryDisaster.year}
              data={years}
              defaultValue={"2024"}
              clearable
              onChange={(v) =>
                setQueryDisaster({ ...queryDisaster, year: v ?? "" })
              }
            />
          </div>
          <BarChartDisaster year={queryDisaster.year} />
        </Card>
        {/* <Card>
          <h2 className="text-black font-semibold text-2xl">
            Wilayah <span className="text-primary-700 text-lg">Tahun 2024</span>
          </h2>
          <BarChartArea />
        </Card> */}
      </section>
      <SimpleGrid cols={1} className="mt-5">
        <Card>
          <div className="flex gap-5 mb-5">
            <h2 className="text-black font-semibold text-2xl">Provinsi</h2>
            <Select
              placeholder="Pilih Tahun"
              value={queryProvince.year}
              data={years}
              defaultValue={"2024"}
              clearable
              onChange={(v) =>
                setQueryProvince({ ...queryProvince, year: v ?? "" })
              }
            />
          </div>
          <BarChartProvince year={queryProvince.year} />
        </Card>
      </SimpleGrid>
    </>
  );
};
