import { Button, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { IconCheck, IconChecklist, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { Regencies } from "../types";
import { useProvinceSelect } from "../api/getProvinceSelect";
import { useCreateRegencies } from "../api/createRegencies";
import { useUpdateRegencies } from "../api/updateRegencies";

type props = {
  data?: Regencies;
};

export const FormRegencies: React.FC<props> = ({ data }: props) => {
  const isUpdate = !!data;
  const createRegencies = useCreateRegencies();
  const { data: vProvince } = useProvinceSelect();
  const updateRegencies = useUpdateRegencies();
  const form = useForm({
    initialValues: {
      province_id: data?.province_id || 0,
      name: data?.name || "",
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const regency_id = data?.regency_id;
    const province_id = +values.province_id;
    const name = values.name;

    const action = isUpdate ? updateRegencies : createRegencies;
    await action.mutateAsync(
      {
        data: {
          regency_id,
          province_id,
          name,
        },
      },
      {
        onSuccess: () => {
          notifications.show({
            color: "green",
            message: isUpdate
              ? "Regencies Berhasil Diperbarui"
              : "Regencies Berhasil Ditambahkan",
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
        label="Nama Provinsi"
        value={data?.province_id}
        placeholder="Pilih Provinsi"
        data={vProvince}
        {...form.getInputProps("province_id")}
      />
      <TextInput
        label="Nama Kabupaten / Kota"
        placeholder="Masukan Kota"
        {...form.getInputProps("name")}
        className="mt-2"
      />
      <div className="flex justify-end gap-2">
        <Button
          mt="md"
          type="submit"
          leftSection={<IconChecklist />}
          disabled={
            isUpdate ? updateRegencies.isLoading : createRegencies.isLoading
          }
        >
          Simpan
        </Button>
      </div>
    </form>
  );
};
