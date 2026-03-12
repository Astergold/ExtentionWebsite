import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Eye, EyeOff, Copy, Check, RefreshCw, Zap, Search, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const RAZORPAY_URL = 'https://rzp.io/rzp/P96c1sh';

export default function Dashboard() {
  const { user, session, profile, signOut, refreshSession } = useAuth();

  const email = user?.email ?? '';
  const plan = profile?.plan ?? 'free';
  const credits = profile?.credits ?? 0;
  const createdAt = profile?.created_at;
  const isFree = plan === 'free';

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <nav className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md gradient-primary">
            <Search className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">AstriQ</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{email}</span>
          <button onClick={signOut} className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </nav>

      <div className="mx-auto grid max-w-5xl gap-5 p-6 md:grid-cols-2">
        <AccountCard email={email} plan={plan} />
        <CreditsCard credits={credits} isFree={isFree} />
        {isFree && <UpgradeCard email={email} />}
        <TokenCard accessToken={session?.access_token ?? ''} onRefresh={refreshSession} />
        <UsageCard credits={credits} isFree={isFree} createdAt={createdAt} plan={plan} />
      </div>
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-card-border bg-card p-5 ${className}`}>
      {children}
    </div>
  );
}

function AccountCard({ email, plan }: { email: string; plan: string }) {
  const initial = email.charAt(0).toUpperCase();
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Account</h3>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
          {initial}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{email}</p>
          {plan === 'pro' ? (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full gradient-pro px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
              <Zap className="h-3 w-3" /> Pro
            </span>
          ) : (
            <span className="mt-1 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Free
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function CreditsCard({ credits, isFree }: { credits: number; isFree: boolean }) {
  const pct = isFree ? Math.min((credits / 50) * 100, 100) : 100;
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Credits</h3>
      {isFree ? (
        <>
          <p className="text-4xl font-extrabold text-foreground">{credits}<span className="text-lg text-muted-foreground">/50</span></p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Resets every Monday · 50 credits/week</p>
          {credits <= 10 && (
            <div className="mt-3 rounded-md border border-accent bg-accent/10 px-3 py-2 text-xs text-accent">
              ⚠️ Low credits! Consider upgrading to Pro.
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-4xl font-extrabold text-gradient-pro">∞</p>
          <p className="mt-2 text-xs text-muted-foreground">Unlimited scraping with Pro plan</p>
        </>
      )}
    </Card>
  );
}

function UpgradeCard({ email }: { email: string }) {
  const url = `${RAZORPAY_URL}?prefill[email]=${encodeURIComponent(email)}`;
  return (
    <Card className="md:col-span-2 border-accent/30">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Zap className="h-5 w-5 text-accent" /> Upgrade to Pro
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>✓ Unlimited leads/week</li>
            <li>✓ Priority support</li>
            <li>✓ Never worry about credits</li>
          </ul>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md gradient-pro px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
        >
          Upgrade Now <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}

function TokenCard({ accessToken, onRefresh }: { accessToken: string; onRefresh: () => Promise<void> }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accessToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <Card className="md:col-span-2">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Connect Chrome Extension</h3>
      <p className="mb-4 text-xs text-muted-foreground">Paste this token into your Chrome extension to sync your account.</p>

      <div className="flex items-center gap-2">
        <div className="flex-1 overflow-hidden rounded-md border border-border bg-secondary px-3 py-2 font-mono text-xs text-foreground">
          {revealed ? accessToken : '•'.repeat(Math.min(accessToken.length, 60))}
        </div>
        <button onClick={() => setRevealed(!revealed)} className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground">
          {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button onClick={handleCopy} className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
        </button>
        <button onClick={handleRefresh} className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground" disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        ⚠️ This token expires periodically. If the extension disconnects, return here to copy a fresh token.
      </p>

      <div className="mt-4 space-y-2 rounded-md border border-border bg-secondary/50 p-3">
        <p className="text-xs font-semibold text-foreground">How to connect:</p>
        <ol className="list-inside list-decimal space-y-1 text-xs text-muted-foreground">
          <li>Copy the token above</li>
          <li>Click the AstriQ extension icon in Chrome</li>
          <li>Paste your token and click "Connect"</li>
        </ol>
      </div>
    </Card>
  );
}

function UsageCard({ credits, isFree, createdAt, plan }: { credits: number; isFree: boolean; createdAt?: string; plan: string }) {
  const leadsThisWeek = isFree ? 50 - credits : '—';
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Usage Stats</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Leads scraped this week</span>
          <span className="font-medium text-foreground">{leadsThisWeek}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Member since</span>
          <span className="font-medium text-foreground">{createdAt ? format(new Date(createdAt), 'MMM d, yyyy') : '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Current plan</span>
          <span className="font-medium text-foreground capitalize">{plan}</span>
        </div>
      </div>
    </Card>
  );
}
