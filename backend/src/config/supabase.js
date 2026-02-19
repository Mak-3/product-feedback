import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('⚠️  Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
}

// Public client (respects RLS policies)
export const supabase = createClient(
  supabaseUrl || '',
  supabasePublishableKey || ''
);

// Admin client (bypasses RLS - use carefully)
export const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceKey || supabasePublishableKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default supabase;






