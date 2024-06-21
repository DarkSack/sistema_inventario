import { Box, Grid, Tabs } from "@mantine/core";
import { LogInView } from "./LogIn";
import { SignUpView } from "./SignUp";
import { Divider } from "keep-react";
import { useState } from "react";

export const SignInView = () => {
  const [activeTab, setActiveTab] = useState("Login");

  return (
    <Grid className="pt-4">
      <Grid.Col span={12}>
        <Box maw={340} mx={"auto"}>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            variant="pills"
            inverted
          >
            <Tabs.Panel value="Login" pb="xs">
              <LogInView />
            </Tabs.Panel>
            <Tabs.Panel value="SignUp" pb="xs">
              <SignUpView />
            </Tabs.Panel>
            <Tabs.List>
              <Tabs.Tab className="ml-5 mr-20" value="Login">
                Iniciar sesión
              </Tabs.Tab>
              <Tabs.Tab value="SignUp">Registrarse</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Box>
        <Divider size="xl" color="cyan" label="Otras opciones" />
      </Grid.Col>
    </Grid>
  );
};
