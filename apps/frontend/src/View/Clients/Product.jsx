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
import Swal from "sweetalert2";
import { useDebounce } from "@uidotdev/usehooks";
import { useFetch } from "@mantine/hooks";
import { useBaseURL } from "../../hooks/useBaseURL";
export const Product = () => {
  const [productData, setProductData] = useState([]);
  const [search, setSearch] = useState("");

  // Debounce the search term
  const debouncedSearchTerm = useDebounce(search, 400);

  // useFetch hook to fetch data with the debounced search term
  const { data, loading, error, refetch } = useFetch(
    useBaseURL(`product?${debouncedSearchTerm}`),
    {}
  );
  // Use useEffect to trigger refetch when debouncedSearchTerm changes
  useEffect(() => {
    if (debouncedSearchTerm) refetch();
  }, [debouncedSearchTerm, refetch]);

  // Update productData when data changes
  useEffect(() => {
    if (data) setProductData(data.data);
  }, [data]);

  // Handle errors and show Swal alert
  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        timer: 1000,
      });
    }
  }, [error]);

  if (!loading)
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
                      src={product.productImage ?? "https://picsum.photos/160"}
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
