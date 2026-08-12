import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { useLocale } from '@/lib/LocaleContext';
import { Globe } from 'lucide-react';

export default function RegionUnitsModal({ open, onOpenChange }) {
  const { settings, saveSettings } = useLocale();
  const [draft, setDraft] = useState(settings);

  useEffect(() => { if (open) setDraft(settings); }, [open, settings]);

  const update = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const apply = () => { saveSettings(draft); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-brand" /> Region & Units
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Preferred currency</Label>
            <Select value={draft.currency} onValueChange={(v) => update('currency', v)}>
              <SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Date format</Label>
            <Select value={draft.dateFormat} onValueChange={(v) => update('dateFormat', v)}>
              <SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Time format</Label>
            <Select value={draft.timeFormat} onValueChange={(v) => update('timeFormat', v)}>
              <SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Unit system (weight, temperature, distance)</Label>
            <Select value={draft.unitSystem} onValueChange={(v) => update('unitSystem', v)}>
              <SelectTrigger className="min-h-[44px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, °C, km)</SelectItem>
                <SelectItem value="imperial">Imperial (lbs, °F, mi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={apply}>Save preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}