import {
  Grid,
  Box,
  Checkbox,
  TextInput,
  Divider,
  Avatar,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { TwitchLogo, DiscordLogo, GoogleLogo } from "phosphor-react";
import {useAuth} from "../../Context/AuthContext";

export const LogInView = () => {
  const { signIn } = useAuth();
  const avatarData = [
    {
      icon: <TwitchLogo size={32} />,
      onClick: () => signIn("twitch"),
    },
    {
      icon: <DiscordLogo size={32} />,
      onClick: () => signIn("discord"),
    },
    {
      icon: <GoogleLogo size={32} />,
      onClick: () => signIn("google"),
    },
  ];
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      terms: false,
      user: {
        email: "",
        password: "",
      },
    },
    validate: {
      user: {
        email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
        password: (value) => (value.length < 6 ? "Too short" : null),
      },
      terms: (value) =>
        value === true ? null : "You must accept terms and conditions",
    },
  });

  return (
    <Grid className="mt-20">
      <Grid.Col span={12}>
        <Box maw={340} mx="auto">
          <form
            onSubmit={form.onSubmit((values) => signIn("withPassword", values))}
          >
            <TextInput
              label="Ingresa tu correo electronico"
              placeholder="Ingresa tu correo electronico"
              key={form.key("user.email")}
              {...form.getInputProps("user.email")}
            />
            <TextInput
              label="Ingresa una contraseña segura"
              placeholder="Ingresa una contraseña segura"
              mt="md"
              key={form.key("user.password")}
              {...form.getInputProps("user.password")}
            />
            <Checkbox
              label="Acepto términos y condiciones"
              mt="sm"
              key={form.key("terms")}
              {...form.getInputProps("terms", { type: "checkbox" })}
            />
            <Button className="mt-5 mb-5 ml-28" type="submit">
              Iniciar sesión
            </Button>
          </form>
          <Divider size={"xl"} color="cyan" label="Otras opciones" />
        </Box>
      </Grid.Col>
      <Box className="flex m-auto gap-10" maw={340} mx="auto">
        {avatarData.map((avatar, index) => (
          <Avatar
            key={index}
            onClick={avatar.onClick}
            style={{ cursor: "pointer" }}
          >
            {avatar.icon}
          </Avatar>
        ))}
      </Box>
    </Grid>
  );
};
