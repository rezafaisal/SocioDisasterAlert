import { Button, PasswordInput, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { User, role } from "../types";
import { IconChecklist } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { useCreateUser } from "../api/createUser";
import { useUpdateUser } from "../api/updateUser";

type props = {
  data?: User;
};

export const FormUser: React.FC<props> = ({ data }: props) => {
  const isUpdate = !!data;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const form = useForm({
    initialValues: {
      full_name: data?.full_name || "",
      username: data?.username || "",
      role: data?.role || "",
      email: data?.email || "",
      password: "",
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const user_id = data?.user_id;
    const dataUpdate = {
      user_id,
      full_name: values.full_name,
      email: values.email,
      role: values.role,
      username: values.username,
    };
    const action = isUpdate ? updateUser : createUser;
    await action.mutateAsync(
      {
        data: isUpdate ? dataUpdate : values,
      },
      {
        onSuccess: () => {
          notifications.show({
            color: "green",
            message: isUpdate
              ? "User Berhasil Diperbarui"
              : "User Berhasil Ditambahkan",
          });
          modals.closeAll();
        },
        onError: ({ response, message }) => {
          if (response?.data.errors) {
            form.setErrors(response.data.errors);
          } else {
            notifications.show({
              message,
              color: "red",
            });
          }
        },
      }
    );
  });
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-5">
        <TextInput
          label="Nama Lengkap"
          placeholder="Nida Mualimah"
          required
          {...form.getInputProps("full_name")}
        />
        <TextInput
          label="Username"
          placeholder="Nida001"
          required
          {...form.getInputProps("username")}
        />
      </div>
      <Select
        data={role}
        className="mt-2"
        placeholder="Pilih Role"
        label="Role"
        {...form.getInputProps("role")}
      />
      <TextInput
        className="mt-2"
        type="email"
        label="Email"
        placeholder="Ex. Budi@gmail.com"
        {...form.getInputProps("email")}
      />
      {!isUpdate && (
        <PasswordInput
          type="password"
          className="mt-2"
          label="Password"
          placeholder="Kata Sandi"
          {...form.getInputProps("password")}
        />
      )}

      <div className="flex justify-end gap-2">
        <Button
          mt="md"
          type="submit"
          leftSection={<IconChecklist />}
          disabled={isUpdate ? updateUser.isLoading : createUser.isLoading}
        >
          Simpan
        </Button>
      </div>
    </form>
  );
};
