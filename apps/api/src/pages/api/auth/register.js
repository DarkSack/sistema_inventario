import dbConnect from "../../../utils/dbConnect";
import Users from "../../../models/Users";
import jwt from "jsonwebtoken";
import { runCorsMiddleware } from "../../../utils/cors";

export default async function handler(req, res) {
  await runCorsMiddleware(req, res);
  await dbConnect();
  const { method } = req;
  if (method === "POST") return registerUser(req, res);
  return res.status(405).json({ message: "Method not supported" });
}

/**
 * Function to handle user login
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */
const registerUser = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  if (!userEmail || !userPassword) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const existingUser = await Users.findOne({ userEmail });
  console.log("🚀 ~ registerUser ~ existingUser:", existingUser);
  if (existingUser)
    return res
      .status(418)
      .json({ status: false, message: "The user is already register" });
  try {
    // Buscar el usuario por email
    const user = await Users.create({ userPassword, userEmail });
    // Excluir la contraseña del objeto de usuario
    const { userPassword: _, ...userWithoutPassword } = user.toObject();

    // Generar JWT
    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("🚀 ~ registerUser ~ token:", token);

    // Enviar respuesta exitosa con datos del usuario
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: token,
    });
  } catch (error) {
    if (error.message == null || error.message == undefined) {
      const user = await Users.findOne({ userEmail });
      const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: token,
      });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
};
