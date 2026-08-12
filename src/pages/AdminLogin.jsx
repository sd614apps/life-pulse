import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const returnTo = params.get('returnTo') || '/admin/system';
      await base44.auth.loginViaEmailPassword(email, password);
      // loginViaEmailPassword hard-redirects to returnTo; fall back if it returns.
      window.location.href = returnTo;
    } catch (err) {
      setError(err?.message || 'Invalid credentials.');
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border/70 bg-card p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand"><ShieldCheck className="h-5 w-5" /></div>
          <div>
            <h1 className="font-heading text-lg font-semibold text-foreground">Admin Presentation Mode</h1>
            <p className="text-xs text-muted-foreground">Secure admin sign-in</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="e">Admin email</Label>
            <Input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-[48px]" autoFocus required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p">Password</Label>
            <Input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="min-h-[48px]" required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={busy} className="min-h-[48px] w-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">Restricted to admin accounts · MFA available</p>
      </div>
    </div>
  );
}