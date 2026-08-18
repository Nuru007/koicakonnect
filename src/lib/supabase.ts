import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zrmsaphrfjiezpcxnjgg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybXNhcGhyZmppZXpwY3huamdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjEzNzksImV4cCI6MjEwMjYzNzM3OX0.-TFHGXNuhFeLWGO6lfkyCZmMDxEVD1Jn2EMoASGFTDQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
