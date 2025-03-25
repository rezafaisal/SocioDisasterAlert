import { Tweets } from "@/features/maps/types";
import { Button, Select, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import { Category, Disaster, years } from "../types";
import { IconChecklist } from "@tabler/icons-react";
import { useCreateTweet } from "../api/createTweet";
import { useUpdateTweet } from "../api/updateTweet";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { useProvinceSelect } from "../api/getProvinceSelect";

type props = {
  data?: Tweets;
};

export const FormTweet: React.FC<props> = ({ data }: props) => {
  const isUpdate = !!data;
  const { data: province } = useProvinceSelect();
  const createTweet = useCreateTweet();
  const updateTweet = useUpdateTweet();
  const form = useForm({
    initialValues: {
      full_text: data?.full_text || "",
      disaster: data?.disaster || "",
      image_url: data?.image_url || "",
      username: data?.username || "",
      year: data?.year || "",
      tweet_date: data?.tweet_date || "",
      location: data?.location || "",
      url_profile: data?.url_profile || "",
      category: data?.category || "",
      latitude: data?.latitude || "",
      longitude: data?.longitude || "",
      province_id: data?.province_id || 0,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    const action = isUpdate ? updateTweet : createTweet;
    const tweet_id = data?.tweet_id;
    const province_id = +values.province_id;

    await action.mutateAsync(
      {
        data: {
          ...values,
          tweet_id,
          province_id,
        },
      },
      {
        onSuccess: () => {
          notifications.show({
            color: "green",
            message: isUpdate
              ? "Tweet Berhasil Diperbarui"
              : "Tweet Berhasil Ditambahkan",
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
        <Select
          label="Bencana"
          placeholder="Pilih Bencana"
          required
          data={Disaster}
          {...form.getInputProps("disaster")}
        />
        <Select
          label="Category"
          placeholder="Pilih Kategori"
          required
          data={Category}
          {...form.getInputProps("category")}
        />
        <TextInput
          label="Tanggal Postingan"
          type="date"
          required
          {...form.getInputProps("tweet_date")}
        />
        <Select
          data={years}
          label="Tahun"
          placeholder="Pilih Tahun Tweet"
          required
          {...form.getInputProps("year")}
        />
        <TextInput
          description="Cth: -2.12312412"
          label="Latitude"
          required
          {...form.getInputProps("latitude")}
        />
        <TextInput
          description="Cth: 110.2131241"
          label="Longitude"
          required
          {...form.getInputProps("longitude")}
        />
        <TextInput
          label="Posted By:"
          required
          {...form.getInputProps("username")}
        />
        <TextInput label="URL Profile" {...form.getInputProps("url_profile")} />
      </div>
      <Textarea
        className="mt-2"
        label="Caption"
        placeholder="Ex. Caption Tweets"
        {...form.getInputProps("full_text")}
      />
      <TextInput
        className="mt-2"
        label="Lokasi"
        {...form.getInputProps("location")}
      />
      <Select
        searchable
        className="mt-2"
        value={data?.province_id}
        clearable
        data={province}
        label="Provinsi"
        placeholder="Pilih Provinsi"
        required
        {...form.getInputProps("province_id")}
      />
      <TextInput
        className="mt-2"
        label="URL Gambar"
        {...form.getInputProps("image_url")}
      />

      <div className="flex justify-end gap-2">
        <Button
          mt="md"
          type="submit"
          leftSection={<IconChecklist />}
          disabled={isUpdate ? updateTweet.isLoading : createTweet.isLoading}
        >
          Simpan
        </Button>
      </div>
    </form>
  );
};
