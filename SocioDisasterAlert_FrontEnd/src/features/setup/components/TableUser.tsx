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
import { Pagination } from "@/types/api";
import { useUsers } from "../api/getUsers";
import dayjs from "dayjs";
import { FormUser } from "./FormUser";
import { User } from "../types";
import { useDeleteUser } from "../api/deleteUser";
import { UserDetail } from "./UserDetail";

type props = {
  toolbar?: React.ReactNode;
} & Pagination;
export const TableUser: React.FC<props> = ({ toolbar, ...props }) => {
  const [params, setParams] = useState<Pagination>({
    page: 1,
    limit: 10,
    search: "",
  });
  const { data, isLoading } = useUsers({ params: { ...params, ...props } });
  const handleDetail = (data: User) => {
    modals.open({
      title: "Detail User",
      size: "lg",
      centered: true,
      children: <UserDetail data={data} />,
    });
  };
  const handleUpdate = (data: User) => {
    modals.open({
      title: "Edit User",
      size: "lg",
      centered: true,
      children: <FormUser data={data} />,
    });
  };
  const deleteUser = useDeleteUser();
  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: "Hapus User",
      size: "md",
      radius: "md",
      children: (
        <div className="text-md">
          Apakah anda yakin untuk menghapus User ini?
        </div>
      ),
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        await deleteUser.mutateAsync(
          { id },
          {
            onSuccess: () => {
              notifications.show({
                message: "User berhasil dihapus",
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
        title="Table Pengguna"
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
          <tr key={items.user_id}>
            <td>{(params.limit ?? 5) * ((params.page ?? 0) - 1) + i + 1}</td>
            <td>{items.full_name}</td>
            <td>{items.username}</td>
            <td>{items.email}</td>
            <td>{items.role}</td>
            <td>{dayjs(items.created_at).format("D MMMM YYYY H:mm")}</td>
            <td>
              <div className="flex items-center space-x-2">
                <ActionIcon
                  variant="subtle"
                  title="Update User"
                  color="blue"
                  radius="lg"
                  onClick={() => handleUpdate(items)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  title="Hapus User"
                  color="red"
                  radius="lg"
                  onClick={() => handleDelete(items.user_id)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  title="Detail User"
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
          "Nama Lengkap",
          "Username",
          "Email",
          "Role",
          "Tanggal Dibuat",
          "Aksi",
        ]}
      />
    </div>
  );
};
