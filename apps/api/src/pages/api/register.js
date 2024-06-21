import dbConnect from "../../utils/dbConnect";
import Users from "../../models/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  if (method === "POST") return createUser(req, res);
  return res.status(405).json({ message: "Method not supported" });
}

/**
 * Function to register a new user
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */

const createUser = async (req, res) => {
  // Verificamos si la contraseña está presente
  if (!req.body.userPassword) {
    return res.status(400).json({ error: "Password is required" });
  }
  // Desestructuramos el cuerpo de la solicitud para obtener los campos necesarios
  const { userPassword, ...userData } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await Users.findOne({ userEmail: req.body.userEmail });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    // Crear nuevo usuario
    const newUser = await Users.create({
      userPassword: hashedPassword,
      ...userData,
    });
    // Excluir la contraseña del objeto de usuario para el JWT
    const { userPassword: _, ...userWithoutPassword } = newUser.toObject();
    // Generar JWT
    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Configurar la cookie
    const userCookie = serialize("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      sameSite: "strict",
      path: "/",
    });
    // Establecer la cookie en la respuesta
    res.setHeader("Set-Cookie", userCookie);
    // Enviar respuesta exitosa con datos del usuario
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
