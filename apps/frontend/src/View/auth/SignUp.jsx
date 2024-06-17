import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuth } from "../../Context/AuthContext";

export const SignUpView = () => {
  const { signIn } = useAuth();

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

  const handleSubmit = (values) => {
    const email = values.user.email;
    const password = values.user.password;
    const credentials = {
      email,
      password,
    };
    signIn("WithCredentials", credentials);
  };

  return (
    <Grid className="mt-20">
      <Grid.Col span={12}>
        <Box maw={340} mx="auto">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Ingresa tu correo electronico"
              placeholder="Ingresa tu correo electronico"
              key={form.key("user.email")}
              {...form.getInputProps("user.email")}
            />
            <PasswordInput
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
              Registrarse
            </Button>
          </form>
          <Divider size={"xl"} color="cyan" label="Otras opciones" />
        </Box>
      </Grid.Col>
    </Grid>
  );
};
