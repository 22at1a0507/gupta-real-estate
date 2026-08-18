import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials (from Vercel environment variables)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_PUBLISHABLE_KEY || '';

console.log('🔗 Supabase URL:', supabaseUrl ? '✅ Yes' : '❌ No');
console.log('🔑 Supabase Key:', supabaseKey ? '✅ Yes' : '❌ No');

export const supabase = createClient(supabaseUrl, supabaseKey);
