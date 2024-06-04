import { supabase } from "../../../SupabaseClient";

export default async function handler(req, res) {
  const { provider } = req.query;

  // Asegurarse de que el proveedor esté permitido
  const allowedProviders = ["twitch", "discord"];
  if (!allowedProviders.includes(provider)) {
    return res.status(400).json({ provider });
  }

  try {
    // Iniciar el flujo de autenticación con el proveedor
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json(data?.url);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
