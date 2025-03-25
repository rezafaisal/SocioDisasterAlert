import React from "react";
import { Regencies } from "../types";
import { Table } from "@mantine/core";

type props = {
  data: Regencies;
};
export const RegenciesDetail: React.FC<props> = ({ data }: props) => {
  return (
    <Table striped highlightOnHover>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>Regency Id</Table.Th>
          <Table.Td>{data.regency_id}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Td>{data.name}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Provinsi</Table.Th>
          <Table.Td>{data.province}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};
