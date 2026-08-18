import { createClient } from '@supabase/supabase-js';

// Use VITE_ prefixed variables for Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
                    '';

const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    '';

console.log('🔗 Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('🔑 Supabase Key:', supabaseKey ? '✅ Set (length: ' + supabaseKey.length + ')' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables are missing!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
