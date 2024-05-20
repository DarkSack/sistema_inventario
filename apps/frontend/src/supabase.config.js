import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_APIKEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
