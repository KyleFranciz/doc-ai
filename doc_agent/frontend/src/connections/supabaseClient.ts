import { createClient } from "@supabase/supabase-js";

// create client for supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// check if the .env variables were set properly on the frontend
if (!supabaseUrl) {
  console.log("Supabase Url was not set properly on the frontend");
}
if (!supabaseKey) {
  console.log("Supabase Key was not set properly on the frontend");
}

//export the client to be reused in other files
export const supabase = createClient(supabaseUrl, supabaseKey);
