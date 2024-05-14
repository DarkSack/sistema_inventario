import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  NumberInput,
  Grid,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config/config.json";
import Swal from "sweetalert2";

export const Product = () => {
  const [productData, setProductData] = useState([]);
  const [errors, setErrors] = useState("");
  useEffect(() => {
    const server =
      window.location.hostname === "localhost"
        ? config.local
        : config.production;
    axios
      .get(`${server}/api/products`)
      .then(function (res) {
        setProductData(res.data);
      })
      .catch(function (err) {
        setErrors(err);
      });
  }, []);

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
