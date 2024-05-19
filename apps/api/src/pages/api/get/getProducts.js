import {supabase } from "../../../SupabaseClient"
//Get products
export default async function handler(req, res) {
  const { q } = req.query;
  try {
    // Realiza la consulta a la tabla de productos
    const { data: products } = await supabase
      .from("productos")
      .select("*")
      .eq("productEnable", true) // Filtra los productos habilitados
      .gt("productStock", 0); // Filtra las existencias mayores a 0
    let dataResponse = products;

    // Filtra los datos según la consulta
    if (q) {
      if (Array.isArray(q)) {
        return res
          .status(400)
          .json({ message: "La búsqueda debe ser un único valor" });
      }

      const search = q.toString().toLowerCase();
      const filterData = products.filter((row) => {
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
