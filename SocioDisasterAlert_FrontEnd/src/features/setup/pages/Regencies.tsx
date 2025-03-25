import { Button, TextInput } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { Pagination } from "@/types/api";
import { TableRegencies } from "../components/TableRegencies";
import { modals } from "@mantine/modals";
import { FormRegencies } from "../components/FormRegencies";
import { Helmet } from "react-helmet-async";
import { CardIndonesia } from "@/features/dashboard/pages/CardIndonesia";

export const Regencies = () => {
  const [query, setQuery] = useState<Pagination>({
    search: "",
  });
  const [params] = useDebouncedValue(query, 500);
  const handleCreate = () => {
    modals.open({
      title: "Tambah Kota",
      size: "lg",
      children: <FormRegencies />,
    });
  };
  return (
    <main>
      <Helmet>
        <title>Kota / Kabupaten</title>
        <meta name="description" content="List Kota / Kabupaten" />
      </Helmet>
      <h1 className="text-4xl font-bold mb-6 font-poppins">Kota | Kabupaten</h1>
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
              placeholder="Cari Kabupaten"
              value={query.search}
              onChange={(v) => setQuery({ ...query, search: v.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="mb-8 w-full">
        <TableRegencies {...params} />
      </section>
    </main>
  );
};
