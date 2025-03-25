import { Loader } from "@mantine/core";
import {
  IconBrandCitymapper,
  IconGlobe,
  IconKeyFilled,
  IconMap2,
} from "@tabler/icons-react";
import { useIndonesia } from "../api/getIndonesia";

export const CardIndonesia = () => {
  const { data } = useIndonesia();
  return (
    <main>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-5 shadow-lg shadow-gray-200">
          <div className="flex justify-between">
            <h2 className="font-normal font-poppins text-lg text-gray-500">
              Total Provinsi
            </h2>
            <div className="p-1.5 rounded-2xl bg-red-100 text-red-600 inline-block">
              <IconGlobe size={50} />
            </div>
          </div>
          <div className="mt-1">
            {data?.total_province !== undefined ? (
              <>
                <span className="font-bold text-4xl">
                  {data.total_province}
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
              Total Kota
            </h2>
            <div className="p-1.5 rounded-2xl bg-blue-100 text-blue-600 inline-block">
              <IconBrandCitymapper size={50} />
            </div>
          </div>
          <div className="mt-1">
            {data?.total_regency !== undefined ? (
              <>
                <span className="font-bold text-4xl">{data.total_regency}</span>
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
              Total Distrik
            </h2>
            <div className="p-1.5 rounded-2xl bg-orange-100 text-orange-600 inline-block">
              <IconMap2 size={50} />
            </div>
          </div>
          <div className="mt-1">
            {data?.total_district !== undefined ? (
              <>
                <span className="font-bold text-4xl">
                  {data.total_district}
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
              Total keywords
            </h2>
            <div className="p-1.5 rounded-2xl bg-orange-100 text-orange-600 inline-block">
              <IconKeyFilled size={50} />
            </div>
          </div>
          <div className="mt-1">
            {data?.total_keyword !== undefined ? (
              <>
                <span className="font-bold text-4xl">{data.total_keyword}</span>
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
