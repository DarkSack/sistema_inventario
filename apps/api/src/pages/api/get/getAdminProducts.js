import { supabase } from "../../../SupabaseClient";

//Get products
export default async function handler(req, res) {
  const { q } = req.query;
  try {
    // Realiza la consulta a la tabla de productos
    const { data: products, error } = await supabase.from("productos").select(
      `productId,
         productName,
         productDescription,
         productPrice,
         productStock,
         category:categorias(
           categoryName
         ),
         provider:providers(
          providerName
         )
         `
    );

    if (error) {
      throw new Error(error.message);
    }

    // Estructura los productos correctamente
    const dataProducts = products.map((product) => ({
      id: product.productId,
      productName: product.productName,
      productDescription: product.productDescription,
      productPrice: product.productPrice,
      productStock: product.productStock,
      categoryName: product?.category?.categoryName,
      providerName: product?.provider?.providerName,
    }));

    let dataResponse = dataProducts;

    // Filtra los datos según la consulta
    if (q) {
      if (Array.isArray(q)) {
        return res
          .status(400)
          .json({ message: "La búsqueda debe ser un único valor" });
      }

      const search = q.toString().toLowerCase();
      const filterData = dataProducts.filter((row) => {
        return Object.values(row).some((value) => {
          // Verifica si el valor no es nulo ni indefinido
          if (value !== null && value !== undefined) {
            // Convierte el valor a cadena y busca la coincidencia
            return value.toString().toLowerCase().includes(search);
          }
          return false;
        });
      });
      dataResponse = filterData;
    }

    // Devuelve los productos encontrados
    return res.status(200).json(dataResponse);
  } catch (error) {
    // Maneja los errores
    return res.status(500).json({ error: error.message });
  }
}
