require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");

const express = require("express");
const app = express();
const port = 3005;

//Create supabase client
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.PROJECT_URL;
const supabaseKey = process.env.APIKEY;
const supabase = createClient(supabaseUrl, supabaseKey);

//Configure Express
app.use(bodyParser.json());
app.use(cors());

//Create endpoints
app.get("/api/products", async (req, res) => {
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
});
//Create product
app.post("/api/addProduct", async (req, res) => {
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
  console.log(req.body);

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
});

//Create order
app.post("/api/createOrder", async (req, res) => {
  try {
    const { productData, quantity } = req.body;
    productId = productData.productId;
    // Obtener información del producto
    const { data: product, error: productError } = await supabase
      .from("productos")
      .select("*")
      .eq("productId", productData.productId)
      .single();

    switch (true) {
      case Boolean(productError):
        throw productError;
      case !product:
        throw new Error("El producto no existe");
      case !product.productEnable:
        throw new Error("El producto está deshabilitado");
      case product.stock < quantity:
        throw new Error("No hay suficientes existencias del producto");
      default:
      // Si ninguno de los casos anteriores es verdadero, no hacer nada
    }

    // Realizar la transacción
    const { error: transactionError } = await supabase.transaction(
      async (tx) => {
        // Crear el pedido
        const { data: pedido, error: pedidoError } = await tx
          .from("pedidos")
          .insert([{ productId, quantity }]);

        if (pedidoError) {
          throw pedidoError;
        }

        // Actualizar el stock del producto
        const { error: updateError } = await tx
          .from("productos")
          .update({
            stock: product.stock - quantity,
            productEnable: product.stock - quantity > 0,
          })
          .eq("productId", productId);

        if (updateError) {
          throw updateError;
        }
      }
    );

    if (transactionError) {
      throw transactionError;
    }

    // Si todo sale bien, responder con éxito
    res.status(200).json({ message: "Pedido creado exitosamente" });
  } catch (error) {
    // Manejar errores
    console.error("Error al procesar el pedido:", error.message);
    res.status(400).json({ error: error.message });
  }
});
app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
});
