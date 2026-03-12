import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let redirected = false;

    const redirect = (path: string) => {
      if (!redirected) {
        redirected = true;
        navigate(path, { replace: true });
      }
    };

    // Listen for auth state change triggered by hash fragment
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        redirect('/dashboard');
      } else if (event === 'INITIAL_SESSION') {
        if (session) {
          redirect('/dashboard');
        } else {
          // No session from hash — wait a bit then fallback
          setTimeout(() => redirect('/'), 2000);
        }
      }
    });

    // Hard timeout fallback in case nothing fires
    const timeout = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        redirect(session ? '/dashboard' : '/');
      });
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
