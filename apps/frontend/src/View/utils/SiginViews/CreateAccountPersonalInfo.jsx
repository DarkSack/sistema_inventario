import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  NumberInput,
  Radio,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import PropTypes from "prop-types";
import { useFormContext } from "../../../Context/FormContext";

export const CreateAccountPersonalInfoView = (props) => {
  const { updateFormData, formData } = useFormContext();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      user: {
        userName: "",
        gender: "",
        phoneNumber: "",
        age: "",
      },
    },
    validate: {
      user: {
        userName: (value) =>
          value.length < 5 ? "Name must have at least 5 letters" : null,
        gender: (value) =>
          value !== "Male" || value !== "Female"
            ? null
            : "Must select a gender",
        phoneNumber: (value) =>
          value.length < 10
            ? "Phone number must have at least 10 digits"
            : null,
        age: (value) =>
          value < 18 ? "You must be at least 18 to register" : null,
      },
    },
  });

  const handleSubmit = (values) => {
    updateFormData("step2", values);
    props.nextStep();
  };
  return (
    <Grid className="mt-20">
      <Grid.Col span={12}>
        <Box maw={340} mx="auto">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Ingresa tu nombre de usuario"
              placeholder="Ingresa tu nombre de usuario"
              value={formData?.step2?.user?.userName}
              key={form.key("user.userName")}
              {...form.getInputProps("user.userName")}
            />
            <NumberInput
              label="Ingresa tu número télefonico"
              hideControls
              placeholder="Ingresa tu número télefonico"
              mt="md"
              value={formData?.step2?.user?.phoneNumber}
              key={form.key("user.phoneNumber")}
              {...form.getInputProps("user.phoneNumber")}
            />
            <NumberInput
              label="Ingresa tu edad"
              hideControls
              placeholder="Ingresa tu edad"
              mt="md"
              value={formData?.step2?.user?.age}
              key={form.key("user.age")}
              {...form.getInputProps("user.age")}
            />
            <Radio.Group
              name="Gender"
              label="Selecciona tu genero"
              withAsterisk
              value={formData?.step2?.user?.gender}
              key={form.key("user.gender")}
              {...form.getInputProps("user.gender")}
            >
              <Group mt="xs">
                <Radio
                  value="Male"
                  label="Masculino"
                />
                <Radio
                  value="Female"
                  label="Femenino"
                />
              </Group>
            </Radio.Group>
            <Button
              onClick={props.prevStep}
              className="mt-5 mb-5 ml-10 mr-10"
              type="submit"
            >
              Regresar
            </Button>
            <Button className="mt-5 mb-5" type="submit">
              Aceptar
            </Button>
          </form>
          <Divider size={"xl"} color="cyan" label="Otras opciones" />
        </Box>
      </Grid.Col>
    </Grid>
  );
};
CreateAccountPersonalInfoView.propTypes = {
  nextStep: PropTypes.func,
  prevStep: PropTypes.func,
};
