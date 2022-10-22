import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pdboiiptzzkiwtykmevj.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient;
