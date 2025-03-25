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
import { useDistricts } from "../api/getDistricts";
import { DisctrictsDetail } from "./DisctrictsDetail";
import { districts } from "../types";
import { notifications } from "@mantine/notifications";
import { useDeleteDistrict } from "../api/deleteDistrict";
import { FormDistrict } from "./FormDistrict";

type props = {
  toolbar?: React.ReactNode;
} & Pagination;
export const TableDistricts: React.FC<props> = ({ toolbar, ...props }) => {
  const [params, setParams] = useState<Pagination>({
    page: 1,
    limit: 10,
    search: "",
  });
  const { data, isLoading } = useDistricts({ params: { ...params, ...props } });

  const handleDetail = (data: districts) => {
    modals.open({
      title: "Detail Disctricts",
      size: "lg",
      centered: true,
      children: <DisctrictsDetail data={data} />,
    });
  };
  const handleUpdate = (data: districts) => {
    modals.open({
      title: "Edit Kota",
      size: "lg",
      centered: true,
      children: <FormDistrict data={data} />,
    });
  };
  const deleteDistricts = useDeleteDistrict();
  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: "Hapus District",
      size: "md",
      radius: "md",
      children: (
        <div className="text-md">
          Apakah anda yakin untuk menghapus District ini?
        </div>
      ),
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        await deleteDistricts.mutateAsync(
          { id },
          {
            onSuccess: () => {
              notifications.show({
                message: "District Berhasil Dihapus",
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
        title="Table Distrik"
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
          <tr key={items.district_id}>
            <td>{(params.limit ?? 5) * ((params.page ?? 0) - 1) + i + 1}</td>
            <td>{items.name}</td>
            <td>{items.regencies}</td>
            <td>
              <div className="flex items-center space-x-2">
                <ActionIcon
                  variant="subtle"
                  title="Update Distrik"
                  color="blue"
                  radius="lg"
                  onClick={() => handleUpdate(items)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  title="Hapus Distrik"
                  color="red"
                  radius="lg"
                  onClick={() => handleDelete(items.district_id)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  title="Detail Distrik"
                  radius="lg"
                  onClick={() => handleDetail(items)}
                >
                  <IconInfoCircle size={18} />
                </ActionIcon>
              </div>
            </td>
          </tr>
        )}
        header={["No", "Distrik", "Kabupaten", "Aksi"]}
      />
    </div>
  );
};
