// api/permissions.js
import { supabase } from "../../../SupabaseClient";

export default async function handler(req, res) {
  const { method } = req.method;
  switch (method) {
    case "POST":
      // Crear o actualizar permisos para un usuario
      const { user_id, newPermissions } = req.body;
      const { data, error } = await supabase
        .from("user_permissions")
        .upsert([{ user_id, permissions: newPermissions }], {
          onConflict: "user_id",
        });

      if (error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(200).json(data);

    case "GET":
      // Obtener permisos de un usuario
      const { id } = req.query;
      const { data: permissions, error: fetchError } = await supabase
        .from("user_permissions")
        .select("permissions")
        .eq("user_id", id)
        .single();

      if (fetchError) {
        return res.status(400).json({ error: fetchError.message });
      }
      return res.status(200).json(permissions);

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
