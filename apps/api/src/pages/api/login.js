import { supabase } from "../../SupabaseClient";
import { allowCors } from "./cors";

// Handler para manejar la solicitud
async function handler(req, res) {
  const { provider } = req.body; // Obtener el proveedor del cuerpo de la solicitud

  switch (provider) {
    case "google":
    case "discord":
    case "twitch":
      try {
        // Iniciar sesión con OAuth utilizando el proveedor
        const { data, error } = await supabase.auth.signInWithOAuth({ provider });

        if (error) {
          const messages = {
            google: "Error al iniciar sesión con Google",
            discord: "Error al iniciar sesión con Discord",
            twitch: "Error al iniciar sesión con Twitch",
          };
          return res.status(400).json({ message: messages[provider] });
        }

        // Puedes generar un JWT si es necesario
        // const token = generateJWT(data.user);
        // return res.json({ token });

        // Si todo es correcto, devolver la data del usuario
        return res.status(200).json(data);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

    default:
      return res.status(400).json({ message: "Proveedor no soportado" });
  }
}

// Exportar el handler con soporte para CORS
export default allowCors(handler);
