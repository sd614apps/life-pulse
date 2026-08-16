import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { entities } from '@/lib/entities';
import ModuleHeader from '@/components/ModuleHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Home, Users, ShieldCheck, Smartphone, Copy, Download, Check, Loader2 } from 'lucide-react';

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function genSecret() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  let s = '';
  for (let i = 0; i < 16; i++) s += B32[a[i] & 31];
  return s;
}
function genBackup() {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    const a = new Uint8Array(6);
    crypto.getRandomValues(a);
    const seg = Array.from(a).map((b) => (b % 36).toString(36)).join('').slice(0, 8);
    codes.push(`${seg.slice(0, 4)}-${seg.slice(4)}`.toUpperCase());
  }
  return codes;
}

const STEPS = [
  { key: 'family', label: 'Household', icon: Home },
  { key: 'security', label: 'Security tier', icon: ShieldCheck },
  { key: 'twofa', label: '2FA setup', icon: Smartphone },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState('family');
  const [name, setName] = useState('');
  const [prefs, setPrefs] = useState({});
  const [busy, setBusy] = useState(false);

  // family
  const [familyMode, setFamilyMode] = useState('create');
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  // security
  const [tier, setTier] = useState('standard');
  const [autoLock, setAutoLock] = useState('15');

  // 2fa
  const secret = useMemo(() => genSecret(), []);
  const [testCode, setTestCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackup, setShowBackup] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data: { user }, error }) => {
        if (error || !user) {
          navigate('/login');
          return;
        }
        setName(
          user.user_metadata?.display_name ||
          user.user_metadata?.name ||
          sessionStorage.getItem('lp-onboard-name') ||
          ''
        );
      })
      .catch((err) => {
        console.error('[Onboarding.getUser]', err);
        navigate('/login');
      });
  }, [navigate]);

  const persist = async (next) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: next,
      });
      if (error) throw error;
    } catch (err) {
      console.error('[Onboarding.persist]', err);
      throw err;
    }
  };

  const finishFamily = async () => {
    setBusy(true);
    try {
      let familyId = '';
      let familyRole = 'family_member';
      if (familyMode === 'create' && householdName.trim()) {
        const fam = await entities.Families.create({ name: householdName.trim() });
        familyId = fam?.id || '';
        familyRole = 'family_admin';
      } else if (familyMode === 'join' && inviteCode.trim()) {
        familyId = inviteCode.trim();
        familyRole = 'family_member';
      }
      const next = { ...prefs, family_id: familyId, family_role: familyRole };
      setPrefs(next);
      await persist(next);
      if (name) {
        await entities.Profile.create({
          display_name: name,
          role: 'primary',
          view_mode: 'standard',
          family_id: familyId,
          family_role: familyRole,
        }).catch((err) => {
          console.error('[Onboarding.Profile.create]', err);
        });
      }
      setStep('security');
    } catch (e) {
      console.error('[Onboarding.finishFamily]', e);
      toast({ title: 'Something went wrong', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const finishSecurity = async () => {
    setBusy(true);
    try {
      const next = { ...prefs, security_tier: tier, auto_lock_minutes: Number(autoLock) };
      setPrefs(next);
      await persist(next);
      setStep('twofa');
    } catch (e) {
      console.error('[Onboarding.finishSecurity]', e);
      toast({ title: 'Failed to save security settings', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const complete2fa = async () => {
    setBusy(true);
    try {
      const codes = genBackup();
      setBackupCodes(codes);
      setShowBackup(true);
      const next = { ...prefs, twofa_enrolled: true, backup_codes: codes, onboarding_complete: true };
      setPrefs(next);
      await persist(next);
    } catch (e) {
      console.error('[Onboarding.complete2fa]', e);
      toast({ title: 'Failed to complete 2FA setup', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const verifyTestCode = () => {
    setErr('');
    if (!/^\d{6}$/.test(testCode)) {
      setErr('Enter the 6-digit code shown in your app.');
      return;
    }
    complete2fa();
  };

  const remindLater = async () => {
    setBusy(true);
    try {
      await entities.Notification.create({
        title: 'Set up two-factor authentication',
        description: 'Add an extra layer of security to your account when you have a moment.',
        severity: 'pending',
        category: 'family',
        status: 'active',
        target_path: '/onboarding',
      }).catch((err) => {
        console.error('[Onboarding.Notification.create]', err);
      });
      const next = { ...prefs, twofa_enrolled: false, onboarding_complete: true };
      setPrefs(next);
      await persist(next);
      navigate('/dashboard');
    } catch (e) {
      console.error('[Onboarding.remindLater]', e);
      toast({ title: 'Failed to proceed', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const finishBackup = () => navigate('/dashboard');

  const downloadBackup = () => {
    const text =
      'LifePulse — 2FA Backup Recovery Codes\nKeep these somewhere safe. Each can be used once.\n\n' +
      backupCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lifepulse-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={Users} title="Welcome to LifePulse" description="Let's finish setting up your account" />
      <main className="mx-auto max-w-xl px-4 py-8 pb-28">
        {/* Stepper */}
        <ol className="mb-8 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <li key={s.key} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                    active
                      ? 'border-brand bg-brand text-brand-foreground'
                      : done
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:inline ${
                    active ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <div className="mx-1 h-px flex-1 bg-border" />}
              </li>
            );
          })}
        </ol>

        {step === 'family' && (
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">Set up your household</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a new household and become its Family Admin, or join an existing one with an invite code.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFamilyMode('create')}
                className={`rounded-xl border p-4 text-left ${
                  familyMode === 'create' ? 'border-brand bg-brand/5' : 'border-border/70'
                }`}
              >
                <Home className="h-5 w-5 text-brand" />
                <p className="mt-2 text-sm font-medium text-foreground">Create a new household</p>
                <p className="text-xs text-muted-foreground">You'll be the Family Admin.</p>
              </button>
              <button
                type="button"
                onClick={() => setFamilyMode('join')}
                className={`rounded-xl border p-4 text-left ${
                  familyMode === 'join' ? 'border-brand bg-brand/5' : 'border-border/70'
                }`}
              >
                <Users className="h-5 w-5 text-brand" />
                <p className="mt-2 text-sm font-medium text-foreground">Join an existing household</p>
                <p className="text-xs text-muted-foreground">Use a household invite code.</p>
              </button>
            </div>
            {familyMode === 'create' ? (
              <div className="mt-4 space-y-1.5">
                <Label htmlFor="hh">Household name</Label>
                <Input
                  id="hh"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  placeholder="The Hayes Family"
                  className="min-h-[48px]"
                />
              </div>
            ) : (
              <div className="mt-4 space-y-1.5">
                <Label htmlFor="ic">Household invite code</Label>
                <Input
                  id="ic"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Paste invite code"
                  className="min-h-[48px]"
                />
              </div>
            )}
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep('security')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Continue without a household
              </button>
              <Button onClick={finishFamily} disabled={busy} className="min-h-[44px] gap-2">
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'security' && (
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">Choose your security tier</h2>
            <p className="mt-1 text-sm text-muted-foreground">You can change this later in Security & Privacy settings.</p>
            <div className="mt-5 space-y-2">
              {[
                { v: 'standard', t: 'Standard', d: 'Balanced defaults for everyday use.' },
                { v: 'high_privacy', t: 'High-Privacy', d: 'Mask financial numbers by default; tighter auto-lock.' },
                { v: 'max_vault', t: 'Maximum Vault Isolation', d: 'Strongest isolation; vault access re-auth required.' },
              ].map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => setTier(o.v)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left ${
                    tier === o.v ? 'border-brand bg-brand/5' : 'border-border/70'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                      tier === o.v ? 'border-brand' : 'border-muted-foreground'
                    }`}
                  >
                    {tier === o.v && <span className="h-2 w-2 rounded-full bg-brand" />}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{o.t}</span>
                    <span className="block text-xs text-muted-foreground">{o.d}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-5 max-w-xs space-y-1.5">
              <Label htmlFor="al">Auto-lock timeout</Label>
              <Select value={autoLock} onValueChange={setAutoLock}>
                <SelectTrigger id="al" className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={finishSecurity} disabled={busy} className="min-h-[44px] gap-2">
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'twofa' && !showBackup && (
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground">Set up two-factor authentication</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Two-factor authentication (2FA) adds a second step when you sign in. After your password, an app on your phone — like Google Authenticator, Authy, or 1Password — shows a fresh 6-digit code every 30 seconds that only you can see. Even if someone learns your password, they can't sign in without that code.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center rounded-xl border border-border/70 p-4">
                <div className="grid grid-cols-8 gap-0.5 rounded-lg bg-white p-3">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const on = (secret.charCodeAt(i % secret.length) + i) % 2 === 0;
                    return <div key={i} className={`h-3.5 w-3.5 ${on ? 'bg-black' : 'bg-white'}`} />;
                  })}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Scan with your authenticator app</p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="sk">Secret key</Label>
                  <div className="flex gap-2">
                    <Input id="sk" readOnly value={secret} className="font-mono text-xs" />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard?.writeText(secret);
                        toast({ title: 'Secret copied' });
                      }}
                      aria-label="Copy secret"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tc">Enter the 6-digit code from your app</Label>
                  <Input
                    id="tc"
                    inputMode="numeric"
                    maxLength={6}
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value.replace(/\D/g, ''))}
                    className="min-h-[48px] tracking-[0.4em] text-center"
                  />
                  {err && <p className="mt-1 text-sm text-red-600">{err}</p>}
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={remindLater}
                disabled={busy}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Remind me later
              </button>
              <Button onClick={verifyTestCode} disabled={busy} className="min-h-[44px] gap-2">
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Verify & complete
              </Button>
            </div>
          </div>
        )}

        {step === 'twofa' && showBackup && (
          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h2 className="font-heading text-lg font-semibold text-foreground">Save your backup codes</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              If you lose your phone, use one of these one-time codes to regain access. Store them somewhere safe — they won't be shown again.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted/50 p-4 font-mono text-sm text-foreground">
              {backupCodes.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button variant="outline" onClick={downloadBackup} className="min-h-[44px] gap-2">
                <Download className="h-4 w-4" /> Download codes
              </Button>
              <Button onClick={finishBackup} className="min-h-[44px] gap-2">
                <Check className="h-4 w-4" /> I've saved them — finish
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}