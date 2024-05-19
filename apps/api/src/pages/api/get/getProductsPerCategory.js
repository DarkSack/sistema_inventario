import { supabase } from "../../../SupabaseClient";

//Get products per categories
export default async function handler(req, res) {
  const { categoryId } = req.query;
  try {
    const { data } = await supabase
      .from("productos")
      .select("*")
      .eq("categoryId", categoryId);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
