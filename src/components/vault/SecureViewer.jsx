import React from 'react';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { ShieldCheck, AlertTriangle, FileText, Calendar, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const CAT_LABEL = {
  insurance: 'Insurance',
  medical: 'Medical',
  property: 'Property',
  id: 'ID Card',
  legal: 'Legal / Estate',
};

export default function SecureViewer({ item, onClose }) {
  const open = !!item;
  const days = item?.expires_at ? differenceInCalendarDays(parseISO(item.expires_at), new Date()) : null;
  const expiring = days !== null && days <= 60;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="border-border/70 p-0 sm:max-w-lg">
        <div className="border-b border-border/70 bg-card px-6 py-5">
          <DialogTitle className="font-heading text-lg font-semibold text-foreground">{item?.title}</DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">{CAT_LABEL[item?.category] || 'Document'}</DialogDescription>
        </div>
        <div className="space-y-4 px-6 py-6">
          <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 px-4 py-3 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
            <div>
              <p className="text-sm font-semibold">256-Bit Encrypted</p>
              <p className="text-xs">AES-256 encryption at rest · zero-knowledge storage</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-border/70 p-3">
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><Upload className="h-3.5 w-3.5" /> Uploaded</p>
              <p className="mt-1 font-medium text-foreground">{item?.uploaded_at ? format(parseISO(item.uploaded_at), 'd MMM yyyy') : '—'}</p>
            </div>
            <div className="rounded-xl border border-border/70 p-3">
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> Expires</p>
              <p className={`mt-1 font-medium ${expiring ? 'text-amber-600' : 'text-foreground'}`}>
                {item?.expires_at ? format(parseISO(item.expires_at), 'd MMM yyyy') : 'No expiry'}
              </p>
            </div>
          </div>
          <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/40">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-xs text-muted-foreground">Encrypted preview unavailable</p>
            <p className="text-[11px] text-muted-foreground">Tap to decrypt &amp; view (mock)</p>
          </div>
          {expiring && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" /> This document expires in {days} days.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}