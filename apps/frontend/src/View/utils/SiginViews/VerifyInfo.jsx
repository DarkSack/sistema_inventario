import { Box, Grid, TextInput } from "@mantine/core";
import { useFormContext } from "../../../Context/FormContext";

export const VerifyInfoToAccount = () => {
  const { formData } = useFormContext();
  const unifiedObject = {
    ...formData.step1,
    user: {
      ...formData.step1.user,
      ...formData.step2.user
    }
  };
  
  console.log("🚀 ~ VerifyInfoToAccount ~ formData:", unifiedObject)

  return (
    <Grid>
      <Grid.Col>
        <Box maw={340}>
          <TextInput readOnly></TextInput>
        </Box>
      </Grid.Col>
    </Grid>
  );
};
