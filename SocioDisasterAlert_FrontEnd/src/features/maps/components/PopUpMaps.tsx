import React from "react";
import { Tweets } from "../types"; // Pastikan path sesuai dengan struktur project Anda
import { Badge } from "@mantine/core";

type Props = {
  data: Tweets;
};

export const PopUpMaps: React.FC<Props> = ({ data }) => {
  return (
    <div className="p-6 flex flex-col">
      <section className="flex items-center mb-4">
        <img
          src={"/user_default.png"}
          alt="User Profile"
          className="rounded-full"
          width={50}
          height={50}
          loading="lazy"
        />
        <div className="ml-4">
          <div className="text-lg font-medium">
            {data.username ?? "Username Tidak Tersedia"}
          </div>
          <div className="text-sm">
            {data.tweet_date ?? "Tanggal Tidak Tersedia"}
          </div>
        </div>
      </section>
      <section>
        <Badge>{data.category ?? "Tidak Diketahui"}</Badge>
        <div className="text-sm text-justify font-medium  text-gray-600 mt-3">
          {data.full_text ?? "Judul Tidak Tersedia"}
        </div>
        {data.image_url && (
          <img
            src={data.image_url}
            alt="Foto Tweet"
            loading="lazy"
            className="mt-3"
            width={250}
            height={150}
            onError={(e) => {
              e.currentTarget.src = "/image_notfound.jpg";
            }}
          />
        )}
        <div className="mt-3">{data.location ?? "Lokasi Tidak Tersedia"}</div>
      </section>
    </div>
  );
};
