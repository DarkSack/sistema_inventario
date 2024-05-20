import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  NumberInput,
  Grid,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDebounce } from "@uidotdev/usehooks";
import { useDisclosure } from "@mantine/hooks";
import { EditProductModal } from "./Modals/EditProductModal";
import { useUserAuth } from "../AuthContext";

export const Product = () => {
  const { signInWithDiscord, signInWithTwitch, signOut } =
    useUserAuth();
  const [productData, setProductData] = useState([]);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);
  const debouncedSearchTerm = useDebounce(search, 400);
  useEffect(() => {
    const fetchProductData = async () => {
      const server =
        import.meta.env.DEV === true
          ? import.meta.env.VITE_LOCAL_URL
          : import.meta.env.VITE_PROD_URL;
      try {
        const res = await axios.get(`${server}/get/getProducts`, {
          params: { q: debouncedSearchTerm },
        });
        const cate = await axios.get(`${server}/get/getCategories`, {
          params: { q: debouncedSearchTerm },
        });
        console.log("🚀 ~ fetchProductData ~ cate:", cate)
        setProductData(res.data);
      } catch (err) {
        setErrors(err);
      }
    };
    fetchProductData();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const err = errors.messsage;
    if (err) {
      Swal.fire({
        title: { err },
        icon: "error",
        timer: 1000,
      });
    }
  }, [errors]);

  return (
    <>
      <Grid>
        <Button onClick={signInWithTwitch}>Twitch</Button>
        <Button onClick={signInWithDiscord}>Discord</Button>
        <Button onClick={signOut}>Salir</Button>
        <Grid.Col className="mt-3 ml-4" span={8}>
          <TextInput
            onChange={(event) => setSearch(event.currentTarget.value)}
            radius={"lg"}
            placeholder="Bucar..."
          />
        </Grid.Col>
      </Grid>
      <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
        <Grid.Col span={12} className="flex flex-wrap mt-3">
          {productData &&
            productData.map((product) => (
              <Card
                key={product.productId}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="mx-4 mt-4 text-wrap max-w-64"
                onClick={() => {
                  open();
                  setSelectedProductToEdit(product);
                }}
              >
                <Card.Section>
                  <Image
                    src={product.productImage}
                    height={160}
                    alt={product.productName}
                  />
                </Card.Section>
                <Group justify="space-between" mt="md" mb="xs">
                  <Text className="capitalize" fw={500}>
                    {product.productName}
                  </Text>
                  {product.productPrice < 20 && (
                    <Badge color="red">On Sale</Badge>
                  )}
                </Group>
                <Text
                  size="sm"
                  c="dimmed"
                  className="overflow-hidden max-h-10 overflow-y-auto"
                >
                  {product.productDescription}
                </Text>
                <NumberInput
                  className="mt-4"
                  defaultValue={0}
                  allowNegative={false}
                  min={1}
                />
                <Button color="blue" fullWidth mt="md" radius="md">
                  Comprar
                </Button>
              </Card>
            ))}
        </Grid.Col>
        <EditProductModal
          opened={opened}
          close={close}
          transitionProps={{
            transition: "fade",
            duration: 250,
            timingFunction: "linear",
          }}
          selectedProductToEdit={selectedProductToEdit}
        />
      </Grid>
    </>
  );
};
