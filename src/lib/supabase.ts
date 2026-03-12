import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zgshadyixerexfoagphw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnc2hhZHlpeGVyZXhmb2FncGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzE1OTksImV4cCI6MjA4ODcwNzU5OX0.l2kGBpD3i5ns-gp1jLqzLGdYoDo7wU6N7JccF83mf5M";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'implicit',
  },
});
