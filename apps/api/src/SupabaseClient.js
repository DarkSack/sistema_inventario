//Create supabase client
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://pdlbeelplbgqkvjrbhdj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbGJlZWxwbGJncWt2anJiaGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNjI5NDksImV4cCI6MjAzMDgzODk0OX0.iwH-8olnSJ8K4Ujr0oFHmpVl-UU7LkYwBm7NtDT_P0w";
export const supabase = createClient(supabaseUrl, supabaseKey);
