import { supabase } from "../../../SupabaseClient";
import allowCors from "../cors";
async function handler(req, res) {
  const { provider } = req.body;
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Si no hay errores, Supabase redirigirá automáticamente al usuario al proveedor de autenticación
    return res
      .status(200)
      .json({ message: "Redirigiendo al proveedor de autenticación" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default allowCors(handler);
