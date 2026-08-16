import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Mail, Lock, ShieldCheck, ArrowRight, CheckCircle2, Loader2, ChevronLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/lib/AccessibilityContext';
import { entities } from '@/lib/entities';

const PASSKEY_STATE = { idle: 'idle', pending: 'pending', ok: 'ok' };

export default function AuthModal({ open, onOpenChange }) {
  const { setLargeText } = useAccessibility();
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passkey, setPasskey] = useState(PASSKEY_STATE.idle);
  const [step, setStep] = useState('credentials'); // credentials | verify | success
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const selectProfile = (p) => {
    setSelectedId(p.id);
    setEmail(p.email || '');
    setPassword('');
    setPasskey(PASSKEY_STATE.idle);
    // Elderly simplified view automatically enables large text for the demo
    if (p.view_mode === 'simplified') setLargeText(true);
  };

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoadingProfiles(true);

    entities.Profile.list()
      .then((items) => {
        if (!active) return;
        setProfiles(items || []);
        if (items && items.length) selectProfile(items[0]);
        setLoadingProfiles(false);
      })
      .catch((err) => {
        console.error('[AuthModal.Profile.list]', err);
        if (active) setLoadingProfiles(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const reset = () => {
    setStep('credentials');
    setCode('');
    setPassword('');
    setPasskey(PASSKEY_STATE.idle);
  };

  const close = () => {
    onOpenChange(false);
    setTimeout(reset, 200);
  };

  const handlePasskey = () => {
    setPasskey(PASSKEY_STATE.pending);
    setTimeout(() => {
      setPasskey(PASSKEY_STATE.ok);
      setTimeout(() => setStep('verify'), 500);
    }, 1100);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    setStep('verify');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setStep('success');
    }, 1200);
  };

  const selectedProfile = profiles.find((p) => p.id === selectedId);

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border/70 p-0 sm:max-w-md">
        <div className="border-b border-border/70 bg-card px-6 py-5">
          <DialogTitle className="font-heading text-xl font-semibold text-foreground">
            {step === 'credentials' && 'Welcome back to LifePulse'}
            {step === 'verify' && 'Two-factor verification'}
            {step === 'success' && 'You’re verified'}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">
            {step === 'credentials' && 'Choose a profile to sign in securely.'}
            {step === 'verify' && 'Enter the 6-digit code from your authenticator app.'}
            {step === 'success' && 'Your identity has been confirmed.'}
          </DialogDescription>
        </div>

        <div className="px-6 py-6">
          <AnimatePresence mode="wait">
            {step === 'credentials' && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                <Label className="text-xs font-medium text-muted-foreground">Demo profile switcher</Label>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {loadingProfiles && (
                    <div className="flex items-center justify-center rounded-xl border border-dashed border-border py-6 text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading profiles…
                    </div>
                  )}
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectProfile(p)}
                      className={`flex min-h-[56px] items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                        selectedId === p.id
                          ? 'border-brand bg-brand/10'
                          : 'border-border/70 bg-background hover:border-brand/40'
                      }`}
                    >
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                        style={{ backgroundColor: p.avatar_color || 'hsl(174 58% 39%)' }}
                      >
                        {p.display_name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-foreground">
                          {p.tier_label || p.display_name}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {p.age_band} · {p.view_mode} view
                        </div>
                      </div>
                      {selectedId === p.id && <CheckCircle2 className="ml-auto h-5 w-5 text-brand" />}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleContinue} className="mt-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="lp-email">Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="lp-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@family.com"
                        className="min-h-[48px] pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lp-password">Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="lp-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="min-h-[48px] pl-9"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="min-h-[48px] w-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>

                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/70" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="h-px flex-1 bg-border/70" />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePasskey}
                  disabled={passkey === PASSKEY_STATE.pending}
                  className="min-h-[48px] w-full gap-2"
                >
                  {passkey === PASSKEY_STATE.pending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Fingerprint className="h-4 w-4" />
                  )}
                  {passkey === PASSKEY_STATE.pending ? 'Authenticating…' : 'Use Passkey / Biometrics'}
                </Button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  This is a demo flow. Real sign-in is handled through our secure auth pages.
                </p>
              </motion.div>
            )}

            {step === 'verify' && (
              <motion.form
                key="verify"
                onSubmit={handleVerify}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2 rounded-xl bg-brand-soft p-3 text-sm text-brand">
                  <ShieldCheck className="h-4 w-4" />
                  Code sent for {selectedProfile?.tier_label || 'your account'}
                </div>

                <div className="mt-5 space-y-1.5">
                  <Label htmlFor="lp-code">6-digit code</Label>
                  <Input
                    id="lp-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="min-h-[56px] text-center text-2xl tracking-[0.5em]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={code.length < 6 || verifying}
                  className="mt-5 min-h-[48px] w-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {verifying ? 'Verifying…' : 'Verify & sign in'}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              </motion.form>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Authentication complete</h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  You’re signed in as <span className="font-medium text-foreground">{selectedProfile?.tier_label}</span>.
                  Continue to your secure dashboard.
                </p>
                <Button
                  onClick={() => {
                    window.location.href = '/login';
                  }}
                  className="mt-6 min-h-[48px] w-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  Open secure dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}