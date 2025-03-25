import { Table } from "@/components/table/Table";
import { ActionIcon } from "@mantine/core";
import {
  IconCheck,
  IconEdit,
  IconInfoCircle,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { Pagination } from "@/types/api";
import { useProvinces } from "../api/getProvinces";
import { Province } from "../types";
import { modals } from "@mantine/modals";
import { ProvinceDetail } from "./ProvinceDetail";
import { FormProvince } from "./FormProvince";
import { useDeleteProvince } from "../api/deleteProvince";
import { notifications } from "@mantine/notifications";

type props = {
  toolbar?: React.ReactNode;
} & Pagination;
export const TableProvince: React.FC<props> = ({ toolbar, ...props }) => {
  const [params, setParams] = useState<Pagination>({
    page: 1,
    limit: 10,
    search: "",
  });
  const { data, isLoading } = useProvinces({ params: { ...params, ...props } });
  const handleDetail = (data: Province) => {
    modals.open({
      title: "Detail Provinsi",
      size: "lg",
      centered: true,
      children: <ProvinceDetail data={data} />,
    });
  };
  const handleUpdate = (data: Province) => {
    modals.open({
      title: "Edit Provinsi",
      size: "lg",
      centered: true,
      children: <FormProvince data={data} />,
    });
  };
  const deleteProvince = useDeleteProvince();
  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: "Hapus Provinsi",
      size: "md",
      radius: "md",
      children: (
        <div className="text-md">
          Apakah anda yakin untuk menghapus Province ini?
        </div>
      ),
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        await deleteProvince.mutateAsync(
          { id },
          {
            onSuccess: () => {
              notifications.show({
                message: "Provinsi berhasil dihapus",
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
        title="Table Provinsi"
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
          <tr key={items.province_id}>
            <td>{(params.limit ?? 5) * ((params.page ?? 0) - 1) + i + 1}</td>
            <td>{items.name}</td>
            <td>
              <div className="flex items-center space-x-2">
                <ActionIcon
                  variant="subtle"
                  title="Update Provinsi"
                  color="blue"
                  radius="lg"
                  onClick={() => handleUpdate(items)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  title="Hapus Provinsi"
                  color="red"
                  radius="lg"
                  onClick={() => handleDelete(items.province_id)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  title="Detail Provinsi"
                  radius="lg"
                  onClick={() => handleDetail(items)}
                >
                  <IconInfoCircle size={18} />
                </ActionIcon>
              </div>
            </td>
          </tr>
        )}
        header={["No", "Provinsi", "Aksi"]}
      />
    </div>
  );
};
