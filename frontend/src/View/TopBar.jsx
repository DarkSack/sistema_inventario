import { Grid, Tabs } from "@mantine/core";
import { Product } from "./Product";

export const TopBar = () => {
  return (
    <Grid className="pt-4">
      <Grid.Col span={12}>
        <Tabs orientation="horizontal" defaultValue="Home">
          <Tabs.List>
            <Tabs.Tab value="Home">Home</Tabs.Tab>
            <Tabs.Tab value="MyShopping">My Shopping</Tabs.Tab>
            <Tabs.Tab value="MyAccount">My Account</Tabs.Tab>
            <Tabs.Tab value="Help">Help</Tabs.Tab>
            <Tabs.Tab value="Categories">Categories </Tabs.Tab>
            <Tabs.Tab value="About">About</Tabs.Tab>
            <Tabs.Tab value="Logout">Logout</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="Home">{Product()}</Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
};
