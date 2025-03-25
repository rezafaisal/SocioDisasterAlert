import { Loader } from "@mantine/core";
import {
  IconAlertTriangle,
  IconBeach,
  IconTrees,
  IconWaveSquare,
} from "@tabler/icons-react";
import { useCardDisaster } from "../api/getTotalCard";
import React from "react";

type props = {
  title?: string;
};

export const CardDashboard: React.FC<props> = ({ title }) => {
  const { data } = useCardDisaster();
  return (
    <main>
      <h1 className="text-4xl font-bold mb-6 font-poppins">
        {title ?? "Selamat Datang"}
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-5 shadow-lg shadow-gray-200">
          <div className="flex justify-between">
            <h2 className="font-normal font-poppins text-lg text-gray-500">
              Total Bencana
            </h2>
            <div className="p-1.5 rounded-2xl bg-red-100 text-red-600 inline-block">
              <IconAlertTriangle size={50} />
            </div>
          </div>
          <div className="mt-1">
            {data?.total_disaster !== undefined ? (
              <>
                <span className="font-bold text-4xl">
                  {data.total_disaster}
                </span>
                <span className="text-sm font-medium ml-2 text-gray-600"></span>
              </>
            ) : (
              <Loader type="dots" />
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-lg shadow-gray-200">
          <div className="flex justify-between">
            <h2 className="font-normal font-poppins text-lg text-gray-500">
              Total Banjir
            </h2>
            <div className="p-1.5 rounded-2xl bg-blue-100 text-blue-600 inline-block">
              <IconBeach size={50} />
            </div>
          </div>
          <div className="mt-1">
            {data?.total_banjir !== undefined ? (
              <>
                <span className="font-bold text-4xl">{data.total_banjir}</span>
                <span className="text-sm font-medium ml-2 text-gray-600"></span>
              </>
            ) : (
              <Loader type="dots" />
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-lg shadow-gray-200">
          <div className="flex justify-between">
            <h2 className="font-normal font-poppins text-lg text-gray-500">
              Total Kebakaran
            </h2>
            <div className="p-1.5 rounded-2xl bg-orange-100 text-orange-600 inline-block">
              <IconTrees size={50} />
            </div>
          </div>
          <div className="mt-1">
            {data?.total_kebakaran !== undefined ? (
              <>
                <span className="font-bold text-4xl">
                  {data.total_kebakaran}
                </span>
                <span className="text-sm font-medium ml-2 text-gray-600"></span>
              </>
            ) : (
              <Loader type="dots" />
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-lg shadow-gray-200">
          <div className="flex justify-between">
            <h2 className="font-normal font-poppins text-lg text-gray-500">
              Total Gempa
            </h2>
            <div className="p-1.5 rounded-2xl bg-cyan-100 text-cyan-600 inline-block">
              <IconWaveSquare size={50} />
            </div>
          </div>
          <div className="mt-1">
            {data?.total_gempa !== undefined ? (
              <>
                <span className="font-bold text-4xl">{data.total_gempa}</span>
                <span className="text-sm font-medium ml-2 text-gray-600"></span>
              </>
            ) : (
              <Loader type="dots" />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
