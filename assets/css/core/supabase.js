const SUPABASE_URL = "https://vzqicidepdmraygulrey.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_kqRWgOmLISOE2EuLL1s8fw_WN6FJRTI";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);
