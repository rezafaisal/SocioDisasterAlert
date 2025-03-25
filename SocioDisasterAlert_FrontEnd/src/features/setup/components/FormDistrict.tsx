import { Button, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { IconCheck, IconChecklist, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { districts } from "../types";
import { useCreateDisctrict } from "../api/createDistrict";
import { useUpdateDistrict } from "../api/updateDistrict";
import { useRegencieSelect } from "../api/getRegencieSelect";

type props = {
  data?: districts;
};

export const FormDistrict: React.FC<props> = ({ data }: props) => {
  const isUpdate = !!data;
  const createDistrict = useCreateDisctrict();
  const { data: vRegency } = useRegencieSelect();
  const updateDistrict = useUpdateDistrict();
  const form = useForm({
    initialValues: {
      regency_id: data?.regency_id || 0,
      name: data?.name || "",
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const district_id = data?.district_id;
    const regency_id = +values.regency_id;
    const name = values.name;

    const action = isUpdate ? updateDistrict : createDistrict;
    await action.mutateAsync(
      {
        data: {
          regency_id,
          district_id,
          name,
        },
      },
      {
        onSuccess: () => {
          notifications.show({
            color: "green",
            message: isUpdate
              ? "Distrik Berhasil Diperbarui"
              : "Distrik Berhasil Ditambahkan",
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
      <Select
        searchable
        clearable
        label="Nama Kota / Kabupaten"
        value={data?.regency_id}
        placeholder="Pilih Kota / Kabupaten"
        data={vRegency}
        {...form.getInputProps("regency_id")}
      />
      <TextInput
        label="Nama Distrik"
        placeholder="Masukan Nama Distrik"
        {...form.getInputProps("name")}
        className="mt-2"
      />
      <div className="flex justify-end gap-2">
        <Button
          mt="md"
          type="submit"
          leftSection={<IconChecklist />}
          disabled={
            isUpdate ? updateDistrict.isLoading : createDistrict.isLoading
          }
        >
          Simpan
        </Button>
      </div>
    </form>
  );
};
