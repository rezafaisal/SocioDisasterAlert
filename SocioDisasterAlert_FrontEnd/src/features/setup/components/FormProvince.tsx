import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { IconCheck, IconChecklist, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { Province } from "../types";
import { useCreateProvince } from "../api/createProvince";
import { useUpdateProvince } from "../api/updateProvince";

type props = {
  data?: Province;
};

export const FormProvince: React.FC<props> = ({ data }: props) => {
  const isUpdate = !!data;
  const createProvince = useCreateProvince();
  const updateProvince = useUpdateProvince();
  const form = useForm({
    initialValues: {
      name: data?.name || "",
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const province_id = data?.province_id;

    const action = isUpdate ? updateProvince : createProvince;
    await action.mutateAsync(
      {
        data: {
          province_id,
          ...values,
        },
      },
      {
        onSuccess: () => {
          notifications.show({
            color: "green",
            message: isUpdate
              ? "Provinsi Berhasil Diperbarui"
              : "Provinsi Berhasil Ditambahkan",
            icon: <IconCheck />,
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
              icon: <IconX />,
            });
          }
        },
      }
    );
  });
  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Nama Provinsi"
        placeholder="Kalimantan Selatan"
        {...form.getInputProps("name")}
      />
      <div className="flex justify-end gap-2">
        <Button
          mt="md"
          type="submit"
          leftSection={<IconChecklist />}
          disabled={
            isUpdate ? updateProvince.isLoading : createProvince.isLoading
          }
        >
          Simpan
        </Button>
      </div>
    </form>
  );
};
