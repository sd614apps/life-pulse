import React, { useState } from 'react';
import { entities } from '@/lib/entities';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { KeyRound, ShieldCheck, Loader2 } from 'lucide-react';
import { hashPassword, validateStrongPassword } from '@/lib/crypto';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function AdminSettings({ security, onChanged }) {
  const { toast } = useToast();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [busyPw, setBusyPw] = useState(false);
  const [busyMfa, setBusyMfa] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault();
    setErr('');
    
    const v = validateStrongPassword(pw);
    if (v) { 
      setErr(v); 
      return; 
    }
    if (pw !== confirm) { 
      setErr('Passwords do not match.'); 
      return; 
    }

    setBusyPw(true);
    try {
      const { hash, salt } = await hashPassword(pw);
      
      // Update AdminSecurity entity via Supabase
      const updated = await entities.AdminSecurity.update(security.id, {
        password_hash: hash,
        password_salt: salt,
        must_change_password: false,
        last_changed_at: new Date().toISOString(),
      });

      // Get current authenticated user details for audit logging
      const { data: authData } = await supabase.auth.getUser();
      const actorEmail = authData?.user?.email || 'admin';

      // Log the password change in AuditLog entity
      await entities.AuditLog.create({
        event_type: 'password_change',
        message: 'Admin password updated from Account Settings',
        actor: actorEmail,
        severity: 'warning',
        metadata: 'PBKDF2/SHA-256',
      });

      sessionStorage.setItem('lp-admin-pass-ok', 'true');
      
      if (onChanged) {
        onChanged({
          ...security,
          password_hash: hash,
          password_salt: salt,
          must_change_password: false,
          last_changed_at: updated.last_changed_at,
        });
      }

      setPw('');
      setConfirm('');
      toast({ title: 'Admin password updated' });
    } catch (error) {
      console.error('[AdminSettings.changePassword]', error);
      setErr(error.message || 'Failed to update password.');
    } finally {
      setBusyPw(false);
    }
  };

  const toggleMfa = async (next) => {
    setBusyMfa(true);
    try {
      // Update MFA state in AdminSecurity entity
      await entities.AdminSecurity.update(security.id, { mfa_enforced: next });
      
      // Get current authenticated user details
      const { data: authData } = await supabase.auth.getUser();
      const actorEmail = authData?.user?.email || 'admin';

      // Log MFA toggle in AuditLog entity
      await entities.AuditLog.create({
        event_type: 'toggle',
        message: `Enforced MFA ${next ? 'enabled' : 'disabled'} by Admin`,
        actor: actorEmail,
        severity: next ? 'warning' : 'info',
        metadata: 'mfa_enforced',
      });

      if (!next) {
        sessionStorage.removeItem('lp-admin-mfa-ok');
      }

      if (onChanged) {
        onChanged({ ...security, mfa_enforced: next });
      }

      toast({ title: next ? 'MFA enforcement enabled' : 'MFA enforcement disabled' });
    } catch (error) {
      console.error('[AdminSettings.toggleMfa]', error);
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } finally {
      setBusyMfa(false);
    }
  };

  const lastChanged = security?.last_changed_at
    ? formatDistanceToNow(parseISO(security.last_changed_at), { addSuffix: true })
    : 'never';

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <KeyRound className="h-4 w-4" /> Change admin password
        </h3>
        <p className="text-xs text-muted-foreground">Last changed {lastChanged}.</p>
        <form onSubmit={changePassword} className="mt-4 max-w-md space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="np">New password</Label>
            <Input
              id="np"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="min-h-[48px]"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nc">Confirm password</Label>
            <Input
              id="nc"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="min-h-[48px]"
              required
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Min 12 chars · uppercase · lowercase · number · special.
          </p>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <Button type="submit" disabled={busyPw} className="min-h-[44px] gap-2">
            {busyPw && <Loader2 className="h-4 w-4 animate-spin" />} Update password
          </Button>
        </form>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-5">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4" /> Enforced MFA
          </h3>
          <p className="text-xs text-muted-foreground">
            Require a 6-digit code on every admin entry.
          </p>
        </div>
        <Switch
          checked={!!security?.mfa_enforced}
          disabled={busyMfa}
          onCheckedChange={toggleMfa}
        />
      </div>
    </div>
  );
}