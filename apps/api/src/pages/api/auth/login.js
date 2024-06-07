import { supabase } from "../../../SupabaseClient";

export default async function handler(req, res) {
  const { provider, credentials } = req.query;

  // Asegurarse de que el proveedor esté permitido
  const allowedProviders = ["twitch", "discord"];
  if (!allowedProviders.includes(provider)) {
    return res.status(400).json({ provider });
  }

  try {
    if (provider === "WithCredentials") {
      // Registro o autenticación con credenciales
      const { email, password } = credentials;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(200).json(data);
    } else {
      // Proceso de autenticación con un proveedor externo
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(200).json({ url: data?.url }); // Devolver la URL para redirigir al usuario
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
