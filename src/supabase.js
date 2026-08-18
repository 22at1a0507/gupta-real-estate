import { createClient } from '@supabase/supabase-js';

// Try multiple possible variable names
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.SUPABASE_URL || 
                    '';

const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                    import.meta.env.SUPABASE_PUBLISHABLE_KEY || 
                    '';

console.log('🔗🔗🔗 SUPABASE URL:', supabaseUrl);
console.log('🔑🔗🔗 SUPABASE KEY:', supabaseKey ? '✅ Yes (length: ' + supabaseKey.length + ')' : '❌ No');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌❌❌ SUPABASE NOT CONFIGURED! Please add environment variables.');
} else {
  console.log('✅✅✅ SUPABASE CONNECTED!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
