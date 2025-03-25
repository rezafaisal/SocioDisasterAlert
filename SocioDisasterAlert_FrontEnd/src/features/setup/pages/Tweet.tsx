import { Button, Select, TextInput } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { TableTweet } from "../components/TableTweets";
import { Category, Disaster, QueryTweet } from "../types";
import { FormTweet } from "../components/FormTweet";
import { modals } from "@mantine/modals";
import { Helmet } from "react-helmet-async";
import { CardDashboard } from "@/features/dashboard/pages/CardDashboard";
import { Authorization } from "@/features/auth/components/Authorization";

export const Tweets = () => {
  const [query, setQuery] = useState<QueryTweet>({
    search: "",
    category: "",
    disaster: "",
  });
  const [params] = useDebouncedValue(query, 500);
  const handleCreate = () => {
    modals.open({
      title: "Tambah Tweets",
      size: "lg",
      children: <FormTweet />,
    });
  };
  return (
    <main>
      <Helmet>
        <title>Tweet</title>
        <meta name="description" content="List data Tweet" />
      </Helmet>
      <CardDashboard title="Data Tweet" />
      <section className="space-y-4 mb-4">
        <Authorization role={["-Admin", "-Customer"]}>
          <Button
            leftSection={<IconPlus />}
            onClick={() => handleCreate()}
            className="mb-5"
          >
            Tambah
          </Button>
        </Authorization>
        <div className="grid grid-cols-11 gap-4">
          <div className="col-span-12 md:col-span-6 lg:col-span-2">
            <TextInput
              leftSection={<IconSearch size={16} />}
              placeholder="Cari Tweet"
              value={query.search}
              onChange={(v) => setQuery({ ...query, search: v.target.value })}
            />
          </div>
          <div className="col-span-6 md:col-span-6 lg:col-span-2">
            <Select
              placeholder="Cari Kategori"
              value={query.category}
              data={Category}
              clearable
              onChange={(v) => setQuery({ ...query, category: v ?? "" })}
            />
          </div>
          <div className="col-span-6 md:col-span-6 lg:col-span-2">
            <Select
              placeholder="Cari Bencana"
              value={query.disaster}
              data={Disaster}
              clearable
              onChange={(v) => setQuery({ ...query, disaster: v ?? "" })}
            />
          </div>
        </div>
      </section>

      <section className="mb-8 w-full">
        <TableTweet {...params} />
      </section>
    </main>
  );
};
