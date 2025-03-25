import React from "react";
import { User } from "../types";
import { Table } from "@mantine/core";

type props = {
  data: User;
};
export const UserDetail: React.FC<props> = ({ data }: props) => {
  return (
    <Table striped highlightOnHover>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>User ID</Table.Th>
          <Table.Td>{data.user_id}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Nama Lengkap</Table.Th>
          <Table.Td>{data.full_name}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Username</Table.Th>
          <Table.Td>{data.username}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Role</Table.Th>
          <Table.Td>{data.role}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Email</Table.Th>
          <Table.Td>{data.email}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};
