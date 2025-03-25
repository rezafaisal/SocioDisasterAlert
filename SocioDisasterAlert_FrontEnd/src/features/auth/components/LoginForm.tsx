import {
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useLogin } from "../api/login";
import { IconX } from "@tabler/icons-react";

export const LoginForm = () => {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });
  const loginMutation = useLogin();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await loginMutation.mutateAsync(form.values, {
      onError: ({ response }) => {
        if (response?.data.errors) {
          form.setErrors(response.data.errors);
        } else {
          notifications.show({
            message: "Periksa Kembali Username dan Password Anda",
            color: "red",
            icon: <IconX />,
          });
        }
      },
      onSuccess: () => {
        window.location.reload();
      },
    });
  }
  return (
    <Paper radius={20} className="w-[80%] xl:w-[50%] px-10 p-4 xl:p-36 xl">
      <img
        src="/logo-socio.png"
        alt="Sociadis Logo"
        loading="lazy"
        className="w-20 h-20 m-auto"
      />
      <div className="text-center mt-5 mb-12 font-bold text-lg xl:text-2xl">
        Login dengan akun anda
      </div>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Nama Pengguna"
          placeholder="Nama Pengguna Anda"
          size="md"
          required
          {...form.getInputProps("username")}
        />
        <PasswordInput
          label="Kata Sandi"
          placeholder="Kata Sandi Anda"
          mt="md"
          size="md"
          required
          {...form.getInputProps("password")}
        />
        <Button
          fullWidth
          mt="xl"
          radius={"md"}
          type="submit"
          size="md"
          loading={loginMutation.isLoading}
        >
          Login
        </Button>
      </form>

      <Text ta="center" mt="md">
        Tidak Memiliki Akun?{" "}
        <Anchor<"a"> href="/" fw={700}>
          Masuk Tanpa Login
        </Anchor>
      </Text>
    </Paper>
  );
};
