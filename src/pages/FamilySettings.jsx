import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { entities } from '@/lib/entities';
import { useToast } from '@/components/ui/use-toast';
import ModuleHeader from '@/components/ModuleHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Users, UserPlus, Trash2, ShieldAlert, Loader2, Calendar, Wallet, Phone } from 'lucide-react';

const ROLES = [
  { value: 'family_admin', label: 'Family Admin' },
  { value: 'family_member', label: 'Family Member' },
  { value: 'family_dependent', label: 'Dependent' },
];

export default function FamilySettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [shared, setShared] = useState({ calendar: 0, tasks: 0, contacts: 0, budgets: 0 });
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('family_member');
  const [inviting, setInviting] = useState(false);

  const load = async () => {
    const [profiles, cal, tasks, contacts, budgets] = await Promise.all([
      entities.Profile.list().catch(() => []),
      entities.CalendarEvent.list().catch(() => []),
      entities.SharedTask.list().catch(() => []),
      entities.EmergencyContact.list().catch(() => []),
      entities.BudgetCategory.list().catch(() => []),
    ]);
    setMembers(profiles || []);
    setShared({
      calendar: (cal || []).length,
      tasks: (tasks || []).length,
      contacts: (contacts || []).length,
      budgets: (budgets || []).length,
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        if (error || !currentUser) {
          navigate('/login');
          return;
        }

        setUser(currentUser);
        const isFamilyAdmin =
          currentUser.user_metadata?.family_role === 'family_admin' ||
          currentUser.role === 'admin' ||
          currentUser.app_metadata?.role === 'admin';

        setAllowed(isFamilyAdmin);
        if (isFamilyAdmin) await load();
      } catch (err) {
        console.error('[FamilySettings.init]', err);
        navigate('/login');
      } finally {
        setChecking(false);
      }
    })();
  }, [navigate]);

  const setRole = async (id, role) => {
    try {
      await entities.Profile.update(id, { family_role: role });
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, family_role: role } : m)));
      toast({ title: 'Family role updated' });
    } catch (err) {
      console.error('[FamilySettings.setRole]', err);
      toast({ title: 'Update failed', variant: 'destructive' });
    }
  };

  const removeMember = async (id) => {
    if (!confirm('Remove this family member profile?')) return;
    try {
      await entities.Profile.delete(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast({ title: 'Member removed' });
    } catch (err) {
      console.error('[FamilySettings.removeMember]', err);
      toast({ title: 'Remove failed', variant: 'destructive' });
    }
  };

  const invite = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      const { error: inviteError } = await supabase.auth.admin?.inviteUserByEmail
        ? await supabase.auth.admin.inviteUserByEmail(inviteEmail, {
            data: { family_role: inviteRole },
          })
        : await supabase.functions.invoke('inviteUser', {
            body: { email: inviteEmail, role: inviteRole },
          });

      if (inviteError) throw inviteError;

      await entities.AuditLog.create({
        event_type: 'access',
        message: `Family member invited: ${inviteEmail} (${inviteRole})`,
        actor: user?.email || 'admin',
        severity: 'info',
        metadata: inviteRole,
      }).catch(() => {});

      toast({ title: `Invitation sent to ${inviteEmail}` });
      setInviteEmail('');
    } catch (err) {
      console.error('[FamilySettings.invite]', err);
      toast({ title: 'Invitation failed', description: err?.message || '', variant: 'destructive' });
    } finally {
      setInviting(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-background">
        <ModuleHeader icon={Users} title="Family Management" description="" />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">Family admins only</h2>
          <p className="mt-1 text-sm text-muted-foreground">This area is restricted to household admins.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={Users} title="Family Management" description="Members, roles & shared household assets" />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SharedStat icon={Calendar} label="Calendar events" value={shared.calendar} />
          <SharedStat icon={Users} label="Shared tasks" value={shared.tasks} />
          <SharedStat icon={Phone} label="Emergency contacts" value={shared.contacts} />
          <SharedStat icon={Wallet} label="Shared budgets" value={shared.budgets} />
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <UserPlus className="h-4 w-4" /> Invite a family member
          </h3>
          <form onSubmit={invite} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="ie">Email</Label>
              <Input
                id="ie"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="min-h-[44px]"
                required
              />
            </div>
            <div className="w-full space-y-1.5 sm:w-48">
              <Label htmlFor="ir">Family role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger id="ir" className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={inviting} className="min-h-[44px] gap-2">
              {inviting && <Loader2 className="h-4 w-4 animate-spin" />} Send invite
            </Button>
          </form>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">Household members</h3>
          <div className="mt-4 space-y-2">
            {members.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">No family members yet.</p>
            )}
            {members.map((m) => (
              <div
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ background: m.avatar_color || '#0f766e' }}
                  >
                    {(m.display_name || '?').charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{m.display_name}</p>
                    <p className="text-xs text-muted-foreground">{m.email || m.relationship || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={m.family_role || 'family_member'} onValueChange={(v) => setRole(m.id, v)}>
                    <SelectTrigger className="h-9 w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => removeMember(m.id)} aria-label="Remove member">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function SharedStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-heading text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}