import { useEffect, useState } from "react";
import api from "../../config/AxiosAdapter";
import { Badge, Card, Grid, Group, Image, Text } from "@mantine/core";
export const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState("");
  console.log(categories);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/get/getCategories");
        setCategories(res.data);
      } catch (error) {
        setErrors(error.message);
      }
    };
    fetchData();
  }, []);
  if (errors) {
    console.log(errors);
  }
  return (
    <>
      <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
        <Grid.Col span={12} className="flex flex-wrap mt-3">
          {categories &&
            categories.map((category) => (
              <Card
                key={category.categoryId}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="mx-4 mt-4 text-wrap max-w-64"
              >
                <Card.Section>
                  <Image
                    src={category.categoryImage ?? "https://picsum.photos/160"}
                    height={160}
                    alt={category.categoryName}
                  />
                </Card.Section>
                <Group justify="space-between" mt="md" mb="xs">
                  <Text className="capitalize" fw={500}>
                    {category.categoryName}
                  </Text>
                  <Badge color="red">{category.productsAmount} products</Badge>
                </Group>
                <Text
                  size="sm"
                  c="dimmed"
                  className="overflow-hidden max-h-10 overflow-y-auto"
                >
                  {category.categoryDescription}
                </Text>
              </Card>
            ))}
        </Grid.Col>
      </Grid>
    </>
  );
};
