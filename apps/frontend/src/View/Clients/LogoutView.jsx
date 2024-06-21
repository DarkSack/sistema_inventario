import { Empty } from "keep-react";
import { Center, Grid, Image } from "@mantine/core";
import { Button } from "@mantine/core";
import { useAuth } from "../../Context/AuthContext";
export const LogOutView = () => {
  const { logout } = useAuth();
  return (
    <Grid grow>
      <Center>
        <Grid.Col span={12}>
          <Image
            src="https://staticmania.cdn.prismic.io/staticmania/499b23f3-41ed-4bc9-a9eb-43d13779d2f8_Property+1%3DSad+screen_+Property+2%3DSm.svg"
            h={234}
            w={350}
            alt="404"
          />
          <Empty.Title>¿Estás seguro de querer cerrar sesión?</Empty.Title>
          <Empty.Description>
            Te echaremos mucho de menos... Vuelve pronto
          </Empty.Description>
          <Grid.Col span={12}>
            <Button onClick={logout} variant="outline">
              Cerrar Sesión
            </Button>
          </Grid.Col>
        </Grid.Col>
      </Center>
    </Grid>
  );
};
