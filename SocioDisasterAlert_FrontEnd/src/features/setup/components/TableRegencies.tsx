import { Table } from "@/components/table/Table";
import { ActionIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconCheck,
  IconEdit,
  IconInfoCircle,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { Pagination } from "@/types/api";
import { Regencies } from "../types";
import { RegenciesDetail } from "./RegenciesDetail";
import { useRegencies } from "../api/getRegencies";
import { FormRegencies } from "./FormRegencies";
import { useDeleteRegencies } from "../api/deleteRegencies";
import { notifications } from "@mantine/notifications";

type props = {
  toolbar?: React.ReactNode;
} & Pagination;
export const TableRegencies: React.FC<props> = ({ toolbar, ...props }) => {
  const [params, setParams] = useState<Pagination>({
    page: 1,
    limit: 10,
    search: "",
  });
  const { data, isLoading } = useRegencies({ params: { ...params, ...props } });
  const handleDetail = (data: Regencies) => {
    modals.open({
      title: "Detail Kabupaten",
      size: "lg",
      centered: true,
      children: <RegenciesDetail data={data} />,
    });
  };
  const handleUpdate = (data: Regencies) => {
    modals.open({
      title: "Edit Kota",
      size: "lg",
      centered: true,
      children: <FormRegencies data={data} />,
    });
  };
  const deleteRegencies = useDeleteRegencies();
  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: "Hapus Regencies",
      size: "md",
      radius: "md",
      children: (
        <div className="text-md">
          Apakah anda yakin untuk menghapus Regencies ini?
        </div>
      ),
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        await deleteRegencies.mutateAsync(
          { id },
          {
            onSuccess: () => {
              notifications.show({
                message: "Regencies berhasil dihapus",
                color: "green",
                icon: <IconCheck />,
              });
              modals.closeAll();
            },
            onError: ({ response }) => {
              notifications.show({
                message: response?.data.message,
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
        title="Table Kabupaten"
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
          <tr key={items.regency_id}>
            <td>{(params.limit ?? 5) * ((params.page ?? 0) - 1) + i + 1}</td>
            <td>{items.name}</td>
            <td>{items.province}</td>
            <td>
              <div className="flex items-center space-x-2">
                <ActionIcon
                  variant="subtle"
                  title="Update Kota / Kabupaten"
                  color="blue"
                  radius="lg"
                  onClick={() => handleUpdate(items)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  title="Hapus Kota / Kabupaten"
                  color="red"
                  radius="lg"
                  onClick={() => handleDelete(items.regency_id)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  title="Detail Kota / Kabupaten"
                  radius="lg"
                  onClick={() => handleDetail(items)}
                >
                  <IconInfoCircle size={18} />
                </ActionIcon>
              </div>
            </td>
          </tr>
        )}
        header={["No", "Kabupaten", "Provinsi", "Aksi"]}
      />
    </div>
  );
};
