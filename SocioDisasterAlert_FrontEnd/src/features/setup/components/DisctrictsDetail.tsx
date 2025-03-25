import React from "react";
import { districts } from "../types";
import { Table } from "@mantine/core";

type props = {
  data: districts;
};
export const DisctrictsDetail: React.FC<props> = ({ data }: props) => {
  return (
    <Table striped highlightOnHover>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>Disctrict ID</Table.Th>
          <Table.Td>{data.district_id}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Td>{data.name}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Regencies</Table.Th>
          <Table.Td>{data.regencies}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};
