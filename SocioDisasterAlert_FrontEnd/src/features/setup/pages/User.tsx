import { Button, TextInput } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { Pagination } from "@/types/api";
import { TableUser } from "../components/TableUser";
import { FormUser } from "../components/FormUser";
import { modals } from "@mantine/modals";
import { Helmet } from "react-helmet-async";

export const Users = () => {
  const [query, setQuery] = useState<Pagination>({
    search: "",
  });
  const [params] = useDebouncedValue(query, 500);
  const handleCreate = () => {
    modals.open({
      title: "Tambah User",
      size: "lg",
      children: <FormUser />,
    });
  };
  return (
    <main>
      <Helmet>
        <title>Pengguna</title>
        <meta name="description" content="List Data Pengguna" />
      </Helmet>
      <h1 className="text-2xl lg:text-3xl text-gray-700 font-semibold">
        Data Pengguna
      </h1>
      <div className="my-3 w-16 h-[0.15rem] bg-primary-800 rounded-lg"></div>
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
              placeholder="Cari User"
              value={query.search}
              onChange={(v) => setQuery({ ...query, search: v.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="mb-8 w-full">
        <TableUser {...params} />
      </section>
    </main>
  );
};
