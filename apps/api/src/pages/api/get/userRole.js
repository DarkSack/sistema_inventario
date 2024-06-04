import { supabase } from "../../../SupabaseClient";

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Falta el parámetro id" });
  }
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("userRole")
      .eq("userId", id)
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
