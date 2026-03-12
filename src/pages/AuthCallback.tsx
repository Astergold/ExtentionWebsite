import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const redirected = useRef(false);

  useEffect(() => {
    // Only redirect once — ignore any subsequent auth state changes
    if (!loading && !redirected.current) {
      redirected.current = true;
      navigate(user ? '/dashboard' : '/', { replace: true });
    }
  }, [user, loading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
