import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hapgatumhlwkyiycfcny.supabase.co";
const supabaseAnonKey = "sb_publishable_-Xk-3PAIH2HtLR8TKwOdQg_6pm1aXTe";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
