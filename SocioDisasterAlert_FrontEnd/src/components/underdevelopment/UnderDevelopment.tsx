import { Container, Title, Text, Button, Group, Center } from "@mantine/core";
import classes from "./NothingFoundBackground.module.css";
import { Illustration } from "./Ilustration";
import { useNavigate } from "react-router-dom";
import { IconArrowNarrowLeft } from "@tabler/icons-react";

export const UnderDevelopment = () => {
  const navigate = useNavigate();
  return (
    <Container className="mt-48">
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Tidak Ada Konten</Title>
          <Center>
            <Text
              c="dimmed"
              size="lg"
              ta="center"
              className={`${classes.description} my-8`}
            >
              Page Masih Dalam Pengembangan atau Tidak Tersedia, Mohon Tekan
              Kembali
            </Text>
          </Center>
          <Group justify="center">
            <Button
              size="md"
              onClick={() => navigate(-1)}
              className="rounded-full transition-colors duration-300"
            >
              <IconArrowNarrowLeft />
              Kembali
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
};
