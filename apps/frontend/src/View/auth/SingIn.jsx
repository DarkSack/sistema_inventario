import { Box, Grid, Tabs } from "@mantine/core";
import { LogInView } from "./LogIn";
import { SignUpView } from "./SignUp";
import { useAuth } from "../../Context/AuthContext";
import { Divider } from "keep-react";
import { TwitchLogo, DiscordLogo } from "phosphor-react";
import { useState } from "react";

export const SignInView = () => {
  const [activeTab, setActiveTab] = useState("Login");
  const { signIn } = useAuth();

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
            <div className="flex mb-5">
              <TwitchLogo
                className="cursor-pointer	ml-20"
                size={32}
                onClick={() => signIn("twitch")}
              />
              <DiscordLogo
                className="cursor-pointer ml-20"
                size={32}
                onClick={() => signIn("discord")}
              />
            </div>
            <Tabs.List>
              <Tabs.Tab className="ml-5 mr-20" value="Login">Iniciar sesión</Tabs.Tab>
              <Tabs.Tab value="SignUp">Registrarse</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Box>
        <Divider size="xl" color="cyan" label="Otras opciones" />
      </Grid.Col>
    </Grid>
  );
};
