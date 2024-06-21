import dbConnect from "../../utils/dbConnect";
import Users from "../../models/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req, res) {
  await dbConnect();
  const { method } = req;
  switch (method) {
    case "GET":
      await getUser(req, res);
      break;
    case "POST":
      await createUser(req, res);
      break;
    case "PUT":
      await updateProduct(req, res);
      break;
    case "DELETE":
      await deleteUser(req, res);
      break;
    default:
      res.status(402).json({ message: "Method no supported" });
      break;
  }
}

/**
 *
 *  Function to get Users data
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */
const getUser = async (req, res) => {
  const { userId } = req.query;
  try {
    const users = userId
      ? await Users.findOne({ userId })
      : await Users.find({});
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 *
 * Function to create a new Users
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */
const createUser = async (req, res) => {
  try {
    // Hashear la contraseña
    const hashedPassword = bcrypt.hashSync(req.body.userPassword, 10);

    // Crear el objeto de datos del usuario con la contraseña hasheada
    const userData = {
      ...req.body,
      userPassword: hashedPassword,
    };

    // Crear el usuario en la base de datos
    await Users.create(userData);

    // Excluir la contraseña hasheada del JWT
    const { userPassword, ...userWithoutPassword } = userData;

    // Generar JWT
    const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Configurar la cookie
    const userCookie = serialize("user", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      sameSite: "strict",
      path: "/",
    });

    // Establecer la cookie en la respuesta
    res.setHeader("Set-Cookie", userCookie);

    // Enviar respuesta exitosa
    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error al crear usuario" });
  }
};
/**
 *
 * Function to update a users
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */
const updateProduct = async (req, res) => {
  const { userId } = req.query;
  try {
    const updatedProduct = await Users.findOneAndUpdate({ userId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: "Users not found" });
    }

    return res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 *
 * Function to delete a users
 * @param {object} req
 * @param {object} res
 * @returns {object}
 */
const deleteUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const deletedUser = await Users.findOneAndDelete({ userId });
    if (!deletedUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({ success: true, data: deletedUser });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
