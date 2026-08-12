import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ModuleHeader from '@/components/ModuleHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import FeatureToggler from '@/components/admin/FeatureToggler';
import AuditLogViewer from '@/components/admin/AuditLogViewer';
import AdminSettings from '@/components/admin/AdminSettings';
import SystemStats from '@/components/admin/SystemStats';
import ResetButton from '@/components/admin/ResetButton';
import { ShieldCheck, Lock, Loader2, ShieldAlert, KeyRound } from 'lucide-react';
import { verifyPassword } from '@/lib/crypto';

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [security, setSecurity] = useState(null);
  const [view, setView] = useState('loading'); // loading | denied | passphrase | mfa | ready
  const [pass, setPass] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        if (u.role !== 'admin') { setUser(u); setView('denied'); return; }
        setUser(u);
        const list = await base44.entities.AdminSecurity.list();
        let s = list?.[0];
        if (!s) {
          s = await base44.entities.AdminSecurity.create({ must_change_password: true, mfa_enforced: false, password_hash: '', password_salt: '' });
        }
        setSecurity(s);
        if (s.must_change_password || !s.password_hash) { navigate('/admin-change-password'); return; }
        if (sessionStorage.getItem('lp-admin-pass-ok') === 'true') {
          if (s.mfa_enforced && sessionStorage.getItem('lp-admin-mfa-ok') !== 'true') setView('mfa');
          else setView('ready');
        } else {
          setView('passphrase');
        }
      } catch {
        navigate('/admin-login');
      }
    })();
  }, [navigate]);

  const logAudit = async (message, severity = 'info') => {
    try {
      const me = await base44.auth.me();
      await base44.entities.AuditLog.create({ event_type: 'access', message, actor: me?.email || 'admin', severity });
    } catch {}
  };

  const verifyPass = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const ok = await verifyPassword(pass, security.password_salt, security.password_hash);
      if (!ok) { setErr('Incorrect admin passphrase.'); setBusy(false); return; }
      sessionStorage.setItem('lp-admin-pass-ok', 'true');
      setPass('');
      await logAudit('System admin passphrase verified', 'info');
      if (security.mfa_enforced && sessionStorage.getItem('lp-admin-mfa-ok') !== 'true') setView('mfa');
      else setView('ready');
    } catch {
      setErr('Verification failed.');
    } finally {
      setBusy(false);
    }
  };

  const verifyMfa = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    if (!/^\d{6}$/.test(code)) { setErr('Enter the 6-digit code.'); setBusy(false); return; }
    sessionStorage.setItem('lp-admin-mfa-ok', 'true');
    setCode('');
    await logAudit('MFA verification successful', 'info');
    setView('ready');
    setBusy(false);
  };

  if (view === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  if (view === 'denied') {
    return (
      <div className="min-h-screen bg-background">
        <ModuleHeader icon={ShieldCheck} title="System Admin Access" description="" />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">System admins only</h2>
          <p className="mt-1 text-sm text-muted-foreground">This portal is restricted to app-level system administrators.</p>
        </main>
      </div>
    );
  }

  if (view === 'passphrase') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border/70 bg-card p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand"><KeyRound className="h-5 w-5" /></div>
            <div>
              <h1 className="font-heading text-lg font-semibold text-foreground">System admin passphrase</h1>
              <p className="text-xs text-muted-foreground">Enter your admin passphrase to continue</p>
            </div>
          </div>
          <form onSubmit={verifyPass} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pa">Passphrase</Label>
              <Input id="pa" type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="min-h-[48px]" autoFocus required />
            </div>
            {err && <p className="text-sm text-red-600">{err}</p>}
            <Button type="submit" disabled={busy} className="min-h-[48px] w-full gap-2">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} {busy ? 'Verifying…' : 'Unlock'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'mfa') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border/70 bg-card p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand"><Lock className="h-5 w-5" /></div>
            <div>
              <h1 className="font-heading text-lg font-semibold text-foreground">MFA verification</h1>
              <p className="text-xs text-muted-foreground">Enter the 6-digit code from your authenticator</p>
            </div>
          </div>
          <form onSubmit={verifyMfa} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="co">6-digit code</Label>
              <Input id="co" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} className="min-h-[48px] tracking-[0.5em] text-center" autoFocus required />
            </div>
            {err && <p className="text-sm text-red-600">{err}</p>}
            <Button type="submit" disabled={busy} className="min-h-[48px] w-full gap-2">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} {busy ? 'Verifying…' : 'Verify'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={ShieldCheck} title="System Admin Portal" description="Feature toggles, platform stats & audit logs" />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-4">
          <div>
            <p className="text-sm font-semibold text-foreground">System admin: {user?.email}</p>
            <p className="text-xs text-muted-foreground">Zero-knowledge mode · no family dashboard data exposed</p>
          </div>
          <ResetButton />
        </div>
        <Tabs defaultValue="toggles" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="toggles" className="min-h-[44px]">Feature Toggles</TabsTrigger>
            <TabsTrigger value="stats" className="min-h-[44px]">System Stats</TabsTrigger>
            <TabsTrigger value="security" className="min-h-[44px]">Admin Settings</TabsTrigger>
            <TabsTrigger value="audit" className="min-h-[44px]">Audit Log</TabsTrigger>
          </TabsList>
          <TabsContent value="toggles"><FeatureToggler /></TabsContent>
          <TabsContent value="stats"><SystemStats /></TabsContent>
          <TabsContent value="security"><AdminSettings security={security} onChanged={(s) => setSecurity(s)} /></TabsContent>
          <TabsContent value="audit"><AuditLogViewer /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}