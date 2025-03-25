import { Button, TextInput } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { Pagination } from "@/types/api";
import { modals } from "@mantine/modals";
import { TableKeyword } from "../components/TableKeyword";
import { FormKeyword } from "../components/FormKeyword";
import { Helmet } from "react-helmet-async";
import { CardIndonesia } from "@/features/dashboard/pages/CardIndonesia";

export const Keywords = () => {
  const [query, setQuery] = useState<Pagination>({
    search: "",
  });
  const [params] = useDebouncedValue(query, 500);
  const handleCreate = () => {
    modals.open({
      title: "Tambah Kata Kunci",
      size: "lg",
      children: <FormKeyword />,
    });
  };
  return (
    <main>
      <Helmet>
        <title>Keyword</title>
        <meta name="description" content="List Kata Kunci Dataset" />
      </Helmet>
      <h1 className="text-4xl font-bold mb-6 font-poppins">Kata Kunci</h1>
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
              placeholder="Cari Kata Kunci"
              value={query.search}
              onChange={(v) => setQuery({ ...query, search: v.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="mb-8 w-full">
        <TableKeyword {...params} />
      </section>
    </main>
  );
};
