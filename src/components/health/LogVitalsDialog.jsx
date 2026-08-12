import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const METRIC_INFO = {
  blood_pressure: { label: 'Blood Pressure', unit: 'mmHg', isBP: true },
  heart_rate: { label: 'Heart Rate', unit: 'bpm', isBP: false },
  steps: { label: 'Daily Steps', unit: 'steps', isBP: false },
  blood_sugar: { label: 'Blood Sugar', unit: 'mg/dL', isBP: false },
};

export default function LogVitalsDialog({ metric, open, onOpenChange, onLogged }) {
  const [value, setValue] = useState('');
  const [secondary, setSecondary] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const info = METRIC_INFO[metric] || METRIC_INFO.heart_rate;
  const isBP = info.isBP;

  const reset = () => {
    setValue('');
    setSecondary('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await base44.entities.HealthLog.create({
        member_name: 'Eleanor Hayes',
        metric_type: metric,
        value: Number(value),
        secondary_value: isBP ? Number(secondary) : 0,
        unit: info.unit,
        logged_at: new Date().toISOString(),
        status: 'logged',
        notes: '',
      });
      toast({ title: 'Reading saved', description: `${info.label} logged successfully.` });
      onLogged?.();
      onOpenChange(false);
      reset();
    } catch {
      toast({ title: 'Could not save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="border-border/70 p-0 sm:max-w-md">
        <div className="border-b border-border/70 bg-card px-6 py-5">
          <DialogTitle className="font-heading text-lg font-semibold text-foreground">Log {info.label}</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">
            Enter your reading below — large inputs for easy entry.
          </DialogDescription>
        </div>
        <form onSubmit={submit} className="space-y-4 px-6 py-6">
          {isBP ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="v-sys">Systolic ({info.unit})</Label>
                <Input
                  id="v-sys"
                  type="number"
                  inputMode="numeric"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="min-h-[56px] text-lg"
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-dia">Diastolic ({info.unit})</Label>
                <Input
                  id="v-dia"
                  type="number"
                  inputMode="numeric"
                  value={secondary}
                  onChange={(e) => setSecondary(e.target.value)}
                  className="min-h-[56px] text-lg"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="v-val">Value ({info.unit})</Label>
              <Input
                id="v-val"
                type="number"
                inputMode="numeric"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="min-h-[56px] text-lg"
                required
                autoFocus
              />
            </div>
          )}
          <Button
            type="submit"
            disabled={saving}
            className="min-h-[52px] w-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving…' : 'Save reading'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}