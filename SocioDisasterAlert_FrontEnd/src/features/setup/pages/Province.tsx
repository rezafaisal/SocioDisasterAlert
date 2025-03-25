import { Button, TextInput } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { Pagination } from "@/types/api";
import { TableProvince } from "../components/TableProvince";
import { modals } from "@mantine/modals";
import { FormProvince } from "../components/FormProvince";
import { Helmet } from "react-helmet-async";
import { CardIndonesia } from "@/features/dashboard/pages/CardIndonesia";

export const Provinces = () => {
  const [query, setQuery] = useState<Pagination>({
    search: "",
  });
  const [params] = useDebouncedValue(query, 500);
  const handleCreate = () => {
    modals.open({
      title: "Tambah Provinsi",
      size: "lg",
      children: <FormProvince />,
    });
  };
  return (
    <main>
      <Helmet>
        <title>Province</title>
        <meta name="description" content="List Provinsi Data" />
      </Helmet>
      <h1 className="text-4xl font-bold mb-6 font-poppins">Provinsi</h1>
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
              placeholder="Cari Provinsi"
              value={query.search}
              onChange={(v) => setQuery({ ...query, search: v.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="mb-8 w-full">
        <TableProvince {...params} />
      </section>
    </main>
  );
};
