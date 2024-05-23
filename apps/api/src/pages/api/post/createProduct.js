import { supabase } from "../../../SupabaseClient";

//Create product
export default async function handler(req, res) {
  let {
    name,
    description,
    price,
    image,
    categoryId,
    providerId,
    productEnable,
    stock,
  } = req.body;

  try {
    /**
     * Validación de campos requeridos
     */
    if (
      ![
        name,
        description,
        price,
        image,
        categoryId,
        providerId,
        productEnable,
        stock,
      ].every(Boolean)
    ) {
      return res.status(400).json({ message: "Faltan campos" });
    }
    const { data, error } = await supabase.from("productos").insert({
      productName: name,
      productDescription: description,
      productPrice: price,
      productImage: image,
      categoryId,
      providerId,
      productEnable,
      productStock: stock,
    });
    if (error) {
      throw error;
    }
    return res
      .status(200)
      .json({ message: "Producto agregado exitosamente", data });
  } catch (error) {
    console.error("Error al agregar el producto:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
