import { Button, TextInput } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { Pagination } from "@/types/api";
import { TableDistricts } from "../components/TableDistricts";
import { FormDistrict } from "../components/FormDistrict";
import { modals } from "@mantine/modals";
import { Helmet } from "react-helmet-async";
import { CardIndonesia } from "@/features/dashboard/pages/CardIndonesia";

export const Districts = () => {
  const [query, setQuery] = useState<Pagination>({
    search: "",
  });
  const [params] = useDebouncedValue(query, 500);
  const handleCreate = () => {
    modals.open({
      title: "Tambah Distrik",
      size: "lg",
      children: <FormDistrict />,
    });
  };
  return (
    <main>
      <Helmet>
        <title>District</title>
        <meta name="description" content="datatable District Admin" />
      </Helmet>
      <h1 className="text-4xl font-bold mb-6 font-poppins">Distrik</h1>
      <CardIndonesia />
      <section className="space-y-4 mb-4">
        <Button
          leftSection={<IconPlus />}
          onClick={() => handleCreate()}
          className="mb-5"
        >
          Tambah Data
        </Button>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <TextInput
              leftSection={<IconSearch size={16} />}
              placeholder="Cari Distrik"
              value={query.search}
              onChange={(v) => setQuery({ ...query, search: v.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="mb-8 w-full">
        <TableDistricts {...params} />
      </section>
    </main>
  );
};
