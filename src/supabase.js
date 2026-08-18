import { createClient } from '@supabase/supabase-js';

// ✅ Using Vercel's Supabase integration variables
const supabaseUrl = import.meta.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
