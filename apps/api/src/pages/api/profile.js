import { verify } from "jsonwebtoken";
import { allowCors } from "./cors";

function handler(req, res) {
  const { user } = req.cookies;

  if (user) {
    try {
      // Verifica el user
      const decoded = verify(user, process.env.JWT_SECRET);
      res.status(200).json({ user: decoded });
    } catch (err) {
      res.status(401).json(process.env.JWT_SECRET);
    }
  } else {
    res.status(401).json({ message: "No user found" });
  }
}
export default allowCors(handler)