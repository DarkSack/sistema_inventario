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
import config from "../config/config.json";
import Swal from "sweetalert2";
import { useDebounce } from "@uidotdev/usehooks";

export const Product = () => {
  const [productData, setProductData] = useState([]);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState("");
  const debouncedSearchTerm = useDebounce(search, 400);
  useEffect(() => {
    const fetchProductData = async () => {
      const server =
        window.location.hostname === "localhost"
          ? config.local
          : config.production;
      try {
        const res = await axios.get(`${server}/api/products`, {
          params: { q: debouncedSearchTerm },
        });
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
      </Grid>
    </>
  );
};
