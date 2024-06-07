import { Grid, Tabs, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { AdminProductsView } from "../Admin/Products";
import { LogOutView } from "./LogoutView";
import { usePermissions } from "../../Context/PermissionsContext";
import { CategoriesView } from "../Clients/Categories";
export const AdminBar = () => {
  const { hasPermission } = usePermissions();
  const isAuthorized = hasPermission("create_admins");
  const isMobile = useMediaQuery("(max-width: 569px)")
    ? "vertical"
    : "horizontal";

  return (
    <Grid className="pt-4">
      <Grid.Col span={12}>
        <Tabs variant="pills" orientation={isMobile} defaultValue="Home">
          <Tabs.List grow>
            <Tabs.Tab value="ProductsView">Products View</Tabs.Tab>
            <Tabs.Tab value="Categories">Categories</Tabs.Tab>
            <Tabs.Tab value="MyAccount">My Account</Tabs.Tab>
            <Tabs.Tab value="Help">Help</Tabs.Tab>
            <Tabs.Tab value="Categories">Categories</Tabs.Tab>
            {isAuthorized && (
              <Tabs.Tab value="CreateUsers">Create Users</Tabs.Tab>
            )}
            <Tabs.Tab value="LogOut" className="cursor-pointer">
              <Text>Logout</Text>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="ProductsView">{AdminProductsView()}</Tabs.Panel>
          <Tabs.Panel value="Categories">{CategoriesView()}</Tabs.Panel>
          <Tabs.Panel value="LogOut">{LogOutView()}</Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
};
