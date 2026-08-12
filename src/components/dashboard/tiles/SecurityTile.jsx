import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';

export default function SecurityTile() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/security')}
      className="flex flex-col rounded-2xl border border-border/70 bg-card p-5 text-left hover:border-brand/40"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-sm font-semibold text-foreground">Security & Privacy</h3>
        </div>
        <Lock className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-soft px-3 py-2 text-xs text-brand">
        <ShieldCheck className="h-4 w-4" /> Audit your score & active sessions
      </div>
      <p className="mt-3 text-xs text-muted-foreground">2FA, biometrics, auto-lock & access logs</p>
    </button>
  );
}