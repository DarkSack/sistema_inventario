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
  const { productId } = req.query;
  try {
    const products = productId
      ? await Product.findOne({ productId })
      : await Product.find({});
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
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
      { productId },
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
