import {supabase } from "../../../SupabaseClient"
import { allowCors } from "../cors";

//Get categories
async function handler(req, res) {
  try {
    const { data: categories, error: categoriesError } = await supabase
      .from("categorias")
      .select("*");

    if (categoriesError) {
      console.error(
        "Error al obtener las categorías:",
        categoriesError.message
      );
      return res.status(500).json({ error: "Error al obtener las categorías" });
    }

    const { data: products, error: productsError } = await supabase
      .from("productos")
      .select("*")
      .eq("productEnable", true) // Filtra los productos habilitados
      .gt("productStock", 0);

    if (productsError) {
      console.error("Error al obtener los productos:", productsError.message);
      return res.status(500).json({ error: "Error al obtener los productos" });
    }
    const categoriesWithProductsAmount = categories.map((category) => {
      const categoryProducts = products.filter(
        (product) => product.categoryId === category.categoryId
      );
      return {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        categoryDescription: category.categoryDescription,
        productsAmount: categoryProducts.length,
      };
    });
    return res.status(200).json(categoriesWithProductsAmount);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export default allowCors(handler);
