import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const CATS = [
  { value: 'housing', label: 'Housing' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'income', label: 'Income' },
  { value: 'other', label: 'Other' },
];
const MEMBERS = ['Eleanor Hayes', 'Marcus Hayes', 'Arthur Hayes', 'Mia Hayes'];

export default function AddTransactionDialog({ open, onOpenChange, onAdded }) {
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('groceries');
  const [type, setType] = useState('expense');
  const [member, setMember] = useState('Eleanor Hayes');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setDescription('');
    setAmount('');
    setCategory('groceries');
    setType('expense');
    setMember('Eleanor Hayes');
    setDate(new Date().toISOString().slice(0, 10));
  };
  const close = () => { onOpenChange(false); setTimeout(reset, 200); };

  const submit = async (e) => {
    e.preventDefault();
    const amt = Math.abs(Number(amount));
    if (!description.trim() || !amt) return;
    setSaving(true);
    try {
      await base44.entities.Transaction.create({
        description,
        amount: type === 'expense' ? -amt : amt,
        category,
        type,
        family_member: member,
        date,
        notes: '',
      });
      toast({ title: 'Transaction added' });
      onAdded?.();
      close();
    } catch {
      toast({ title: 'Could not save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="border-border/70 p-0 sm:max-w-md">
        <div className="border-b border-border/70 bg-card px-6 py-5">
          <DialogTitle className="font-heading text-lg font-semibold text-foreground">Add transaction</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">Record a new income or expense.</DialogDescription>
        </div>
        <form onSubmit={submit} className="space-y-4 px-6 py-6">
          <div className="space-y-1.5">
            <Label htmlFor="t-desc">Description</Label>
            <Input id="t-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[48px]" required autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="t-amt">Amount</Label>
              <Input id="t-amt" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="min-h-[48px]" required />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="min-h-[48px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="min-h-[48px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Member</Label>
              <Select value={member} onValueChange={setMember}>
                <SelectTrigger className="min-h-[48px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MEMBERS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="t-date">Date</Label>
            <Input id="t-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="min-h-[48px]" required />
          </div>
          <Button type="submit" disabled={saving} className="min-h-[48px] w-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving…' : 'Save transaction'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}