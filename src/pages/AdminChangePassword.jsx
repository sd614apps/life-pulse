import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import ModuleHeader from '@/components/ModuleHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';
import { hashPassword, validateStrongPassword } from '@/lib/crypto';

export default function AdminChangePassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [secId, setSecId] = useState(null);
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        if (u.role !== 'admin') { navigate('/admin'); return; }
        const list = await base44.entities.AdminSecurity.list();
        let s = list?.[0];
        if (!s) {
          s = await base44.entities.AdminSecurity.create({ must_change_password: true, mfa_enforced: false, password_hash: '', password_salt: '' });
        }
        setSecId(s.id);
      } catch {
        navigate('/admin-login');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const v = validateStrongPassword(pw);
    if (v) { setErr(v); return; }
    if (pw !== confirm) { setErr('Passwords do not match.'); return; }
    setBusy(true);
    try {
      const { hash, salt } = await hashPassword(pw);
      await base44.entities.AdminSecurity.update(secId, {
        password_hash: hash,
        password_salt: salt,
        must_change_password: false,
        last_changed_at: new Date().toISOString(),
      });
      const me = await base44.auth.me();
      await base44.entities.AuditLog.create({
        event_type: 'password_change',
        message: 'Admin password set and must_change_password cleared',
        actor: me?.email || 'admin',
        severity: 'warning',
        metadata: 'PBKDF2/SHA-256',
      });
      sessionStorage.setItem('lp-admin-pass-ok', 'true');
      sessionStorage.removeItem('lp-admin-mfa-ok');
      toast({ title: 'Admin password updated' });
      navigate('/admin');
    } catch (e2) {
      setErr('Failed to update password.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={ShieldCheck} title="Change Admin Password" description="Mandatory first-time setup" />
      <main className="mx-auto max-w-md px-4 py-8">
        <div className="rounded-2xl border border-border/70 bg-card p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600"><Lock className="h-5 w-5" /></div>
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground">Set a strong admin password</h2>
              <p className="text-xs text-muted-foreground">Admin access is blocked until this is completed.</p>
            </div>
          </div>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="n">New password</Label>
              <Input id="n" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="min-h-[48px]" autoFocus required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c">Confirm password</Label>
              <Input id="c" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="min-h-[48px]" required />
            </div>
            <p className="text-[11px] text-muted-foreground">Minimum 12 characters with uppercase, lowercase, number, and special character.</p>
            {err && <p className="text-sm text-red-600">{err}</p>}
            <Button type="submit" disabled={busy} className="min-h-[48px] w-full gap-2">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} {busy ? 'Saving…' : 'Update password'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}