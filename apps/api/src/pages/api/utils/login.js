import { supabase } from "../../../SupabaseClient";
import { allowCors } from "../cors";

async function handler(req, res) {
  const { provider } = req.query;
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
    });

    if (error) {
      return res.status(500).json({ error: error });
    }

    // if (data && data.url) {
    //   return res.redirect(data.url); // Redirigir a la URL proporcionada por Supabase
    // } else {
    //   return res.status(400).json({ error: "No URL found in the response." });
    // }
    return data
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default allowCors(handler);
