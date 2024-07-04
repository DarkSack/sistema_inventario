import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productDescription: { type: String },
  productPrice: { type: Number, required: true },
  productStock: { type: Number, required: true },
  categoryId: { type: String, required: true },
  providerId: { type: String, required: true },
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
