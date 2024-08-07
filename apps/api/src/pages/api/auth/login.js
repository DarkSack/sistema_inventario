import dbConnect from "../../../utils/dbConnect";
import Users from "../../../models/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { runCorsMiddleware } from "../../../utils/cors";

export default async function handler(req, res) {
  await runCorsMiddleware(req, res);
  await dbConnect();
  const { method } = req;
  if (method === "POST") return loginUser(req, res);
  return res.status(405).json({ message: "Method not supported" });
}

/**
 * Function to handle user login
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */
const loginUser = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  if (!userEmail || !userPassword) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    // Buscar el usuario por email
    const user = await Users.findOne({ userEmail });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(
      userPassword,
      user.userPassword
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Excluir la contraseña del objeto de usuario
    const { userPassword: _, ...userWithoutPassword } = user.toObject();

    // Generar JWT
    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Enviar respuesta exitosa con datos del usuario
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: token,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
