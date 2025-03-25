import { Center, Loader } from "@mantine/core";

export const CenterLoader = () => {
  return (
    <Center className="w-full h-screen bg-body">
      <Loader />
    </Center>
  );
};
