import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Search, CheckCircle2, Shield } from 'lucide-react';

const features = [
  'Auto-scrape mode',
  'Deduplication',
  'CSV export',
  'Credit system',
  'Pro plan available',
];

export default function Landing() {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="gradient-hero pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary">
            <Search className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            AstriQ Lead Scraper
          </h1>
        </div>

        {/* Tagline */}
        <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
          Scrape LinkedIn Sales Navigator leads in seconds.<br />
          Export to CSV. Sync across devices.
        </p>

        {/* Features */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {features.map((f) => (
            <span
              key={f}
              className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-sm text-foreground"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              {f}
            </span>
          ))}
        </div>

        {/* Google Sign In */}
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-3 rounded-md bg-foreground px-6 py-3 text-base font-semibold text-background transition-opacity hover:opacity-90"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          Your data is private and tied to your account
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
