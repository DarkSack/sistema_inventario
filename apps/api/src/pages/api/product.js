import dbConnect from "../../utils/dbConnect";
import Product from "../../models/Product";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  switch (method) {
    case "GET":
      await getProduct(req, res);
      break;
    case "POST":
      await createProduct(req, res);
      break;
    case "PUT":
      await updateProduct(req, res);
      break;
    case "DELETE":
      await deleteProduct(req, res);
      break;
    default:
      res.status(402).json({ message: "Method no supported" });
      break;
  }
}

/**
 *
 *  Function to get Product data
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */
const getProduct = async (req, res) => {
  const { q } = req.query;
  // Verifica si `q` es un array
  if (q && Array.isArray(q)) {
    return res
      .status(400)
      .json({ message: "La búsqueda debe ser un único valor" });
  }
  try {
    // Obtiene productos, ya sea uno o todos
    const products = await Product.find({});
    if (!products || (Array.isArray(products) && products.length === 0)) {
      return res.status(200).json({ success: true, data: [] });
    }
    // Sustituye `_id` por `id` y transforma a objeto plano
    let dataResponse = products.map((product) => {
      const productObj = product.toObject ? product.toObject() : product;
      const { _id, ...rest } = productObj;
      return { id: _id, ...rest };
    });
    // Filtrado de productos basado en `q`
    if (q) {
      const search = q.toString().toLowerCase();
      dataResponse = products.filter((product) => {
        return Object.values(
          product.toObject ? product.toObject() : product
        ).some((value) => {
          if (value !== null && value !== undefined) {
            // Convierte objetos y arrays a cadenas JSON antes de buscar
            const stringValue =
              typeof value === "object"
                ? JSON.stringify(value)
                : value.toString();
            return stringValue.toLowerCase().includes(search);
          }
          return false;
        });
      });
    }
    return res.status(200).json({ success: true, data: dataResponse });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 *
 * Function to create a new Product
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */
const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 *
 * Function to update a product
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */
const updateProduct = async (req, res) => {
  const { productId } = req.query;
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 *
 * Function to delete a product
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */
const deleteProduct = async (req, res) => {
  const { productId } = req.query;
  try {
    const deletedProduct = await Product.findOneAndDelete({ productId });
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    return res.status(200).json({ success: true, data: deletedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
