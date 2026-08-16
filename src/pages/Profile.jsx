import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { entities } from '@/lib/entities';
import ModuleHeader from '@/components/ModuleHeader';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User as UserIcon, Mail, Phone, ShieldCheck, HelpCircle, Eye, EyeOff } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showSensitive, setShowSensitive] = useState(false);

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data: { user: currentUser }, error }) => {
        if (!error && currentUser) {
          setUser(currentUser);
        }
      })
      .catch((err) => {
        console.error('[Profile.getUser]', err);
      });

    entities.Profile.list()
      .then((list) => setProfile(list?.[0] || null))
      .catch((err) => {
        console.error('[Profile.entities.Profile.list]', err);
      });
  }, []);

  const mask = (v) => (showSensitive ? (v || '—') : (v ? '••••••••' : '—'));

  const displayName =
    profile?.display_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    'Member';

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={UserIcon} title="Profile" description="Your account & privacy preferences" />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6 pb-28 sm:px-6 lg:px-8">
        {/* Identity card */}
        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-xl font-semibold text-brand-foreground">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {displayName}
              </h2>
              <p className="text-sm text-muted-foreground capitalize">
                {profile?.role || 'primary'} · {profile?.view_mode || 'standard'} view
              </p>
            </div>
          </div>
        </div>

        {/* Sensitive data */}
        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-heading text-sm font-semibold text-foreground">Sensitive data</h3>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="show-sensitive" className="text-xs text-muted-foreground">
                {showSensitive ? 'Visible' : 'Hidden'}
              </Label>
              <Switch id="show-sensitive" checked={showSensitive} onCheckedChange={setShowSensitive} />
            </div>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <dt className="w-24 text-muted-foreground">Email</dt>
              <dd className="font-medium text-foreground">{mask(user?.email)}</dd>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <dt className="w-24 text-muted-foreground">Phone</dt>
              <dd className="font-medium text-foreground">{mask(profile?.phone || user?.phone)}</dd>
            </div>
            <div className="flex items-center gap-3">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <dt className="w-24 text-muted-foreground">Display name</dt>
              <dd className="font-medium text-foreground">{profile?.display_name || displayName || '—'}</dd>
            </div>
          </dl>
          {!showSensitive && (
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5" /> Toggle on to reveal sensitive details on this screen.
            </p>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/security')}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4 text-left hover:border-brand/40"
          >
            <ShieldCheck className="h-5 w-5 text-brand" />
            <div>
              <p className="text-sm font-medium text-foreground">Security & Privacy</p>
              <p className="text-xs text-muted-foreground">2FA, sessions & access logs</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4 text-left hover:border-brand/40"
          >
            <HelpCircle className="h-5 w-5 text-brand" />
            <div>
              <p className="text-sm font-medium text-foreground">Contact & Support</p>
              <p className="text-xs text-muted-foreground">Get help with your account</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}