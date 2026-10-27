
const SUPABASE_URL = "https://gdeyzibewmnfbipfvvhd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_AcnVJRIp-_ttasBezDhEUA_AFY1fkO-";

if (!window.supabase) {
  throw new Error("A biblioteca do Supabase não foi carregada.");
}

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.supabaseClient = supabaseClient;
