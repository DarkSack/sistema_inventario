//Create supabase client
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.PROJECT_URL;
const supabaseKey = process.env.APIKEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
