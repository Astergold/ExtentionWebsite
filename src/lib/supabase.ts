import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zgshadyixerexfoagphw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnc2hhZHlpeGVyZXhmb2FncGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjI5OTEsImV4cCI6MjA2Mjc5ODk5MX0.5IzRTmCRBRHALaRiYogI3r1gIBLAEGJBnCIpR9bMsYI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
