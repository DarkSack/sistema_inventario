import { supabase } from "../../../SupabaseClient";

async function handler(req, res) {
  if (req.method === "POST") {
    const { provider } = req.body;
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: "http://localhost:3000",
        },
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
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default handler;
