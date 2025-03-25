import { Table } from "@/components/table/Table";
import { ActionIcon } from "@mantine/core";
import { IconCheck, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { Pagination } from "@/types/api";
import { modals } from "@mantine/modals";
import { useKeywords } from "../api/getKeywords";
import { useDeleteKeyword } from "../api/deleteKeyword";
import { FormKeyword } from "./FormKeyword";
import { keyword } from "@/features/maps/types";
import { notifications } from "@mantine/notifications";

type props = {
  toolbar?: React.ReactNode;
} & Pagination;
export const TableKeyword: React.FC<props> = ({ toolbar, ...props }) => {
  const [params, setParams] = useState<Pagination>({
    page: 1,
    limit: 10,
    search: "",
  });
  const { data, isLoading } = useKeywords({ params: { ...params, ...props } });
  const handleUpdate = (data: keyword) => {
    modals.open({
      title: "Edit Keyword",
      size: "lg",
      centered: true,
      children: <FormKeyword data={data} />,
    });
  };
  const deleteKeyword = useDeleteKeyword();
  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: "Hapus Keyword",
      size: "md",
      radius: "md",
      children: (
        <div className="text-md">
          Apakah anda yakin untuk menghapus Keyword ini?
        </div>
      ),
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        await deleteKeyword.mutateAsync(
          { id },
          {
            onSuccess: () => {
              notifications.show({
                message: "Keyword berhasil dihapus",
                color: "green",
                icon: <IconCheck />,
              });
              modals.closeAll();
            },
            onError: () => {
              notifications.show({
                message: "User tidak bisa dihapus",
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
        title="Table Kata Kunci"
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
          <tr key={items.keyword_id}>
            <td>{(params.limit ?? 5) * ((params.page ?? 0) - 1) + i + 1}</td>
            <td>{items.keyword}</td>
            <td>
              <div className="flex items-center space-x-2">
                <ActionIcon
                  variant="subtle"
                  title="Update Keyword"
                  color="blue"
                  radius="lg"
                  onClick={() => handleUpdate(items)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  title="Hapus Keyword"
                  color="red"
                  radius="lg"
                  onClick={() => handleDelete(items.keyword_id)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </div>
            </td>
          </tr>
        )}
        header={["No", "Keyword", "Aksi"]}
      />
    </div>
  );
};
