import { supabase } from "../../../SupabaseClient";

// Get categories
export default async function handler(req, res) {
  try {
    // Obtener categorías y productos en una sola consulta
    const { data: categoriesWithProducts, error } = await supabase.rpc(
      "get_categories_with_products"
    );

    if (error) {
      return res.status(500).json({ error: "Error al obtener los datos" });
    }
    return res.status(200).json(categoriesWithProducts);
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
