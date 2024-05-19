import { supabase } from "../../../SupabaseClient";
export default async function handler(req, res) {
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
}
