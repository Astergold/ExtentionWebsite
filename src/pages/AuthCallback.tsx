import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const done = useRef(false);

  const go = (path: string) => {
    if (!done.current) {
      done.current = true;
      navigate(path, { replace: true });
    }
  };

  useEffect(() => {
    // Give Supabase time to parse the hash and store the session
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      go(session ? '/dashboard' : '/');
    }, 500);

    // Also listen in case it fires before the timeout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        clearTimeout(timer);
        go('/dashboard');
      }
    });

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
