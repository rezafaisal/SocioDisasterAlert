import React from "react";
import { Table } from "@mantine/core";
import { Tweets } from "@/features/maps/types";

type Props = {
  data: Tweets;
};

export const TweetDetail: React.FC<Props> = ({ data }) => {
  return (
    <Table striped highlightOnHover>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>Judul Tweet</Table.Th>
          <Table.Td>{data.full_text ?? "Judul Tidak Tersedia"}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Tanggal Post</Table.Th>
          <Table.Td>{data.tweet_date ?? "Tanggal Tidak Tersedia"}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Postingan Dari</Table.Th>
          <Table.Td>{data.username ?? "Username Tidak Tersedia"}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Lokasi</Table.Th>
          <Table.Td>{data.location ?? "Lokasi Tidak Tersedia"}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Lampiran</Table.Th>
          <Table.Td>
            {data.image_url ? (
              <img
                src={data.image_url}
                alt="Lampiran"
                width={100}
                onError={(e) => {
                  e.currentTarget.src = "/image_notfound.jpg";
                }}
              />
            ) : (
              "Lampiran Tidak Tersedia"
            )}
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};
