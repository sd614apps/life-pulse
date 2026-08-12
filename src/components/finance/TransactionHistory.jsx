import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMoney } from '@/lib/useMoney';
import { format, parseISO } from 'date-fns';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import AddTransactionDialog from './AddTransactionDialog';

const CATEGORIES = [
  { value: 'all', label: 'All categories' },
  { value: 'housing', label: 'Housing' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'income', label: 'Income' },
  { value: 'other', label: 'Other' },
];
const MEMBERS = ['All members', 'Eleanor Hayes', 'Marcus Hayes', 'Arthur Hayes', 'Mia Hayes'];

export default function TransactionHistory() {
  const { money } = useMoney();
  const [txns, setTxns] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [member, setMember] = useState('All members');
  const [month, setMonth] = useState('');
  const [open, setOpen] = useState(false);

  const load = async () => {
    try { setTxns(await base44.entities.Transaction.list('-date', 300) || []); }
    catch { setTxns([]); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return txns.filter((t) => {
      if (q && !t.description?.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== 'all' && t.category !== cat) return false;
      if (member !== 'All members' && t.family_member !== member) return false;
      if (month && t.date && t.date.slice(0, 7) !== month) return false;
      return true;
    });
  }, [txns, q, cat, member, month]);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">Transaction History</h3>
        <Button onClick={() => setOpen(true)} className="min-h-[44px] gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="h-4 w-4" /> Add transaction
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search description…" className="min-h-[44px] pl-9" />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={member} onValueChange={setMember}>
          <SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {MEMBERS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="min-h-[44px]" />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Date</th>
              <th className="py-2 pr-3 font-medium">Description</th>
              <th className="py-2 pr-3 font-medium">Category</th>
              <th className="py-2 pr-3 font-medium">Member</th>
              <th className="py-2 pr-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No transactions match your filters.</td></tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-border/40">
                <td className="whitespace-nowrap py-2.5 pr-3 text-muted-foreground">{format(parseISO(t.date), 'd MMM yyyy')}</td>
                <td className="py-2.5 pr-3 font-medium text-foreground">{t.description}</td>
                <td className="py-2.5 pr-3 capitalize text-muted-foreground">{t.category}</td>
                <td className="py-2.5 pr-3 text-muted-foreground">{t.family_member || '—'}</td>
                <td className={`py-2.5 pr-3 text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-foreground'}`}>
                  {t.type === 'income' ? '+' : '-'}{money(Math.abs(t.amount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddTransactionDialog open={open} onOpenChange={setOpen} onAdded={load} />
    </div>
  );
}