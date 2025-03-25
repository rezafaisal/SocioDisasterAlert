import React from "react";
import { Province } from "../types";
import { Table } from "@mantine/core";

type props = {
  data: Province;
};
export const ProvinceDetail: React.FC<props> = ({ data }: props) => {
  return (
    <Table striped highlightOnHover>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>Province Id</Table.Th>
          <Table.Td>{data.province_id}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Td>{data.name}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};
