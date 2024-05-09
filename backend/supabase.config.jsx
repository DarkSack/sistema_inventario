import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_APP_PROJECT_URL;
const supabaseKey = process.env.VITE_APP_APIKEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
