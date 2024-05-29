import { Button, Grid, Tabs, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useUserAuth } from "../../Context/AuthContext";
import { Product } from "./Product";

export const TopBar = () => {
  const { signOut } = useUserAuth();
  const isMobile = useMediaQuery("(max-width: 569px)")
    ? "vertical"
    : "horizontal";

  return (
    <Grid className="pt-4">
      <Grid.Col span={12}>
        <Tabs variant="pills" orientation={isMobile} defaultValue="Home">
          <Tabs.List grow>
            <Tabs.Tab value="Home">Home</Tabs.Tab>
            <Tabs.Tab value="MyShopping">My Shopping</Tabs.Tab>
            <Tabs.Tab value="MyAccount">My Account</Tabs.Tab>
            <Tabs.Tab value="Help">Help</Tabs.Tab>
            <Tabs.Tab value="Categories">Categories</Tabs.Tab>
            <Tabs.Tab value="About">About</Tabs.Tab>
            <Tabs.Tab value="LogOut" className="cursor-pointer">
              <Text onClick={() => signOut}>Logout</Text>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="Home">{Product()}</Tabs.Panel>
        </Tabs>
        <Button onClick={signOut}>Cerrar</Button>
      </Grid.Col>
    </Grid>
  );
};
