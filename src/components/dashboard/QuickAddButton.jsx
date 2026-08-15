import React, { useState } from 'react';
import { entities } from '@/lib/entities';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Wallet, HeartPulse, CheckSquare, Plane, ChevronLeft, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const TYPES = [
  { key: 'expense', label: 'Log expense', icon: Wallet, category: 'finance', severity: 'pending', hasAmount: true, titleHint: 'e.g. Electricity Bill' },
  { key: 'health', label: 'Add health metric', icon: HeartPulse, category: 'health', severity: 'upcoming', hasAmount: true, titleHint: 'e.g. Blood pressure' },
  { key: 'task', label: 'Create task', icon: CheckSquare, category: 'family', severity: 'pending', hasAmount: false, titleHint: 'e.g. Renew car insurance' },
  { key: 'trip', label: 'Log a trip', icon: Plane, category: 'travel', severity: 'upcoming', hasAmount: false, titleHint: 'e.g. Flight to Chicago' },
];

export default function QuickAddButton({ onAdded }) {
  const [open, setOpen] = useState(false);
  const [typeKey, setTypeKey] = useState(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const reset = () => {
    setTypeKey(null);
    setTitle('');
    setAmount('');
  };
  
  const close = () => {
    setOpen(false);
    setTimeout(reset, 200);
  };

  const submit = async (e) => {
    e.preventDefault();
    const t = TYPES.find((x) => x.key === typeKey);
    if (!t || !title.trim()) return;
    
    setSaving(true);
    try {
      await entities.Notification.create({
        title: t.hasAmount && amount ? `${title} (${amount})` : title,
        description: 'Logged via Quick Add',
        severity: t.severity,
        category: t.category,
        status: 'active',
        target_path: `/${t.category}`,
        amount: t.hasAmount ? amount : '',
      });

      toast({ title: `${t.label} added`, description: 'It now appears in your Action Center.' });
      onAdded?.();
      close();
    } catch (err) {
      console.error('[QuickAddButton.submit]', err);
      toast({ title: 'Could not save', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Quick Add"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg shadow-brand/30 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand/30"
      >
        <Plus className="h-6 w-6" />
      </button>

      <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
        <DialogContent className="border-border/70 p-0 sm:max-w-md">
          <div className="border-b border-border/70 bg-card px-6 py-5">
            <DialogTitle className="font-heading text-lg font-semibold text-foreground">
              {typeKey ? 'Quick add' : 'What would you like to add?'}
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              {typeKey ? 'One click to log a new item.' : 'Pick a category to log something in seconds.'}
            </DialogDescription>
          </div>

          <div className="px-6 py-6">
            {!typeKey ? (
              <div className="grid grid-cols-2 gap-3">
                {TYPES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTypeKey(t.key)}
                    className="flex min-h-[96px] flex-col items-start gap-3 rounded-xl border border-border/70 bg-background p-4 text-left transition-colors hover:border-brand/50 hover:bg-brand-soft"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <t.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{t.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <button
                  type="button"
                  onClick={() => setTypeKey(null)}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <div className="space-y-1.5">
                  <Label htmlFor="qa-title">Title</Label>
                  <Input
                    id="qa-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={TYPES.find((x) => x.key === typeKey)?.titleHint}
                    className="min-h-[48px]"
                    autoFocus
                    required
                  />
                </div>
                {TYPES.find((x) => x.key === typeKey)?.hasAmount && (
                  <div className="space-y-1.5">
                    <Label htmlFor="qa-amount">Amount / value</Label>
                    <Input
                      id="qa-amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. $140.00 or 120/80"
                      className="min-h-[48px]"
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={saving || !title.trim()}
                  className="min-h-[48px] w-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {saving ? 'Saving…' : 'Add to Action Center'}
                </Button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}