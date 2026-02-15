import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishablekey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabasePublishablekey);
};

// Get configuration error message
export const getConfigError = (): string | null => {
  if (isSupabaseConfigured()) return null;
  
  return (
    'Missing Supabase environment variables!\n\n' +
    'Please create a .env.local file in the root directory with:\n' +
    'NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url\n' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key\n\n' +
    'You can find these values in your Supabase project settings: https://app.supabase.com'
  );
};

// Create Supabase client with validation
let supabaseInstance: SupabaseClient | null = null;

const createSupabaseClient = (): SupabaseClient => {
  if (!isSupabaseConfigured()) {
    // Create a client with placeholder values that will fail gracefully
    // This allows the app to load without breaking
    console.warn('⚠️  Supabase not configured. Authentication features will not work.');
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );
  }

  return createClient(supabaseUrl!, supabasePublishablekey!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
};

// Lazy initialization
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }
  return supabaseInstance;
};

// Export the client (for backward compatibility)
export const supabase = getSupabaseClient();

