import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { IconCheck, IconChecklist, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { keyword } from "@/features/maps/types";
import { useCreateKeyword } from "../api/createKeyword";
import { useUpdateKeyword } from "../api/updateKeyword";

type props = {
  data?: keyword;
};

export const FormKeyword: React.FC<props> = ({ data }: props) => {
  const isUpdate = !!data;
  const createKeyword = useCreateKeyword();
  const updateKeyword = useUpdateKeyword();
  const form = useForm({
    initialValues: {
      keyword: data?.keyword || "",
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const keyword_id = data?.keyword_id;

    const action = isUpdate ? updateKeyword : createKeyword;
    await action.mutateAsync(
      {
        data: {
          keyword_id,
          ...values,
        },
      },
      {
        onSuccess: () => {
          notifications.show({
            color: "green",
            message: isUpdate
              ? "Keyword Berhasil Diperbarui"
              : "Keyword Berhasil Ditambahkan",
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
        label="Kata Kunci"
        placeholder="Kebakaran Hutan"
        {...form.getInputProps("keyword")}
      />
      <div className="flex justify-end gap-2">
        <Button
          mt="md"
          type="submit"
          leftSection={<IconChecklist />}
          disabled={
            isUpdate ? updateKeyword.isLoading : createKeyword.isLoading
          }
        >
          Simpan
        </Button>
      </div>
    </form>
  );
};
