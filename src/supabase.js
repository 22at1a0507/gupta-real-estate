import { createClient } from '@supabase/supabase-js';

// Use VITE_ prefixed variables (Vite requires this prefix for client-side env vars)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('🔗🔗🔗 SUPABASE URL:', supabaseUrl);
console.log('🔑🔗🔗 SUPABASE KEY:', supabaseKey ? '✅ Yes (length: ' + supabaseKey.length + ')' : '❌ No');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌❌❌ SUPABASE NOT CONFIGURED! Please add environment variables.');
} else {
  console.log('✅✅✅ SUPABASE CONNECTED!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
