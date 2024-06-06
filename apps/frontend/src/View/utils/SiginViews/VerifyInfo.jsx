import { Box, Grid, Text, TextInput } from "@mantine/core";
import { useFormContext } from "../../../Context/FormContext";
import React from "react";
export const VerifyInfoToAccount = () => {
  const { formData } = useFormContext();
  const unifiedObject = {
    ...formData.step1,
    user: {
      ...formData.step1.user,
      ...formData.step2.user,
    },
  };

  const UserInfoFields = [
    { label: "Edad", value: unifiedObject.user.age },
    { label: "Email", value: unifiedObject.user.email },
    { label: "Género", value: unifiedObject.user.gender },
    { label: "Número de télefono", value: unifiedObject.user.phoneNumber },
    { label: "Nombre de usuario", value: unifiedObject.user.userName },
    { label: "Contraseña", value: unifiedObject.user.password },
  ];
  return (
    <Grid>
      <Grid.Col>
        <Box mx={"auto"} maw={340}>
          {UserInfoFields.map((field, index) => (
            <React.Fragment key={index}>
              <Text>{field.label}</Text>
              <TextInput readOnly value={field.value} />
            </React.Fragment>
          ))}
        </Box>
      </Grid.Col>
    </Grid>
  );
};
