import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { TwitchLogo, DiscordLogo, GoogleLogo } from "phosphor-react";
import {useAuth} from "../../../Context/AuthContext";
import { useFormContext } from "../../../Context/FormContext";
import PropTypes from "prop-types";

export const CreateAccountView = (props) => {
  const { signIn } = useAuth();
  const credentials = { email: "johanjafet@gmail.com", password: "Sack123" };
  const { updateFormData, formData } = useFormContext();
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

  const handleSubmit = (values) => {
    updateFormData("step1", values);
    props.nextStep();
  };
  return (
    <Grid className="mt-20">
      <Grid.Col span={12}>
        <Box maw={340} mx="auto">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Ingresa tu correo electronico"
              placeholder="Ingresa tu correo electronico"
              value={formData?.step1?.user?.email}
              key={form.key("user.email")}
              {...form.getInputProps("user.email")}
            />
            <PasswordInput
              label="Ingresa una contraseña segura"
              placeholder="Ingresa una contraseña segura"
              mt="md"
              value={formData?.step1?.user?.password}
              key={form.key("user.password")}
              {...form.getInputProps("user.password")}
            />
            <Checkbox
              label="Acepto términos y condiciones"
              mt="sm"
              value={formData?.step1?.user?.terms}
              key={form.key("terms")}
              {...form.getInputProps("terms", { type: "checkbox" })}
            />
            <Button
              className="mt-5 mb-5"
              onClick={() => signIn("withPassword", credentials)}
            >
              Aceptar
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
CreateAccountView.propTypes = {
  nextStep: PropTypes.func,
  prevStep: PropTypes.func,
};
