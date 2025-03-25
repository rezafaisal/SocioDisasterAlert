import { Table } from "@/components/table/Table";
import { ActionIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconEdit,
  IconInfoCircle,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { useTweets } from "../api/getTweets";
import { QueryTweet } from "../types";
import { Tweets } from "@/features/maps/types";
import { TweetDetail } from "./TweetDetail";
import { useDeleteTweet } from "../api/deleteTweet";
import { FormTweet } from "./FormTweet";
import { Authorization } from "@/features/auth/components/Authorization";

type props = {
  toolbar?: React.ReactNode;
} & QueryTweet;
export const TableTweet: React.FC<props> = ({ toolbar, ...props }) => {
  const [params, setParams] = useState<QueryTweet>({
    page: 1,
    limit: 10,
    search: "",
  });
  const { data, isLoading } = useTweets({ params: { ...params, ...props } });
  const handleDetail = (data: Tweets) => {
    modals.open({
      title: "Detail Tweets",
      size: "lg",
      centered: true,
      children: <TweetDetail data={data} />,
    });
  };
  const handleUpdate = (data: Tweets) => {
    modals.open({
      title: "Edit Tweets",
      size: "lg",
      centered: true,
      children: <FormTweet data={data} />,
    });
  };
  const deleteTweet = useDeleteTweet();
  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: "Hapus Tweet",
      size: "md",
      radius: "md",
      children: (
        <div className="text-md">
          Apakah anda yakin untuk menghapus Tweet ini?
        </div>
      ),
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        await deleteTweet.mutateAsync(
          { id },
          {
            onSuccess: () => {
              notifications.show({
                message: "Tweet berhasil dihapus",
                color: "green",
                icon: <IconCheck />,
              });
              modals.closeAll();
            },
            onError: () => {
              notifications.show({
                message: "Tweet tidak bisa dihapus",
                color: "red",
                icon: <IconX />,
              });
              modals.closeAll();
            },
          }
        );
      },
    });
  };
  return (
    <div>
      <Table
        title="Table Tweet"
        items={data?.data}
        loading={isLoading}
        metadata={{
          count: data?.data.length || 10,
          limit: params.limit || 10,
          page: params.page || 10,
          total: data?.total || 10,
        }}
        onPageChange={(page) => {
          setParams({ ...params, page });
        }}
        toolbar={toolbar}
        renderItem={(items, i) => (
          <tr key={items.tweet_id}>
            <td>{(params.limit ?? 5) * ((params.page ?? 0) - 1) + i + 1}</td>
            <td>{items.username}</td>
            <td>{items.location}</td>
            <td>{items.latitude}</td>
            <td>{items.longitude}</td>
            <td>{items.category}</td>
            <td>{items.disaster}</td>
            <td>
              <div className="flex items-center space-x-2">
                <Authorization role={["-Customer", "-Admin"]}>
                  <ActionIcon
                    variant="subtle"
                    title="Update Tweet"
                    color="blue"
                    radius="lg"
                    onClick={() => handleUpdate(items)}
                  >
                    <IconEdit size={18} />
                  </ActionIcon>
                </Authorization>
                <ActionIcon
                  variant="subtle"
                  title="Hapus Tweet"
                  color="red"
                  radius="lg"
                  onClick={() => handleDelete(items.tweet_id)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  title="Detail Tweet"
                  radius="lg"
                  onClick={() => handleDetail(items)}
                >
                  <IconInfoCircle size={18} />
                </ActionIcon>
              </div>
            </td>
          </tr>
        )}
        header={[
          "No",
          "Usename",
          "Location",
          "Latitude",
          "Longtitude",
          "Kategori",
          "Bencana",
          "Aksi",
        ]}
      />
    </div>
  );
};
