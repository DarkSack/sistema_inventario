import { Grid, Tabs } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Product } from "./Product";
import { useMediaQuery } from "@mantine/hooks";

export const TopBar = () => {
  const navigate = useNavigate();
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
            <Tabs.Tab value="LogOut" className="cursor-pointer" onClick={navigate("/logout")}>
              Logout
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="Home">{Product()}</Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
};
