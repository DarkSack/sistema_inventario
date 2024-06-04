import { supabase } from "../../../SupabaseClient";
export default async function handler(req, res) {
  const { ids, user } = req.body;

  if (!user.token)
    return res.status(500).json({ error: "No se proveyo ningún token" });

  const { data: userRole } = await supabase
    .from("admin")
    .select(`userRole`)
    .eq("userId", user.Id)
    .single();
  if (userRole !== "superadmin" || userRole !== "admin")
    return res
      .status(500)
      .json({ error: "No dispone de los permios necesarios" });

  if (!ids.length)
    return res.status(500).json({ error: "No se proveyo ningún id" });

  try {
    const { error } = await supabase
      .from("productos")
      .delete()
      .in("productId", ids);
    if (error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res
        .status(200)
        .json({ message: "Productos eliminado correctamente" });
    }
  } catch (error) {
    return res.status(500).json({ error: error?.message });
  }
}
