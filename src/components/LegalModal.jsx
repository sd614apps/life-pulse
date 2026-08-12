import React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { TermsContent, PrivacyContent } from '@/components/legal/LegalContent';

export default function LegalModal({ type, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">Last updated: August 9, 2026</p>
        <div className="mt-4">
          {type === 'terms' ? <TermsContent /> : <PrivacyContent />}
        </div>
      </DialogContent>
    </Dialog>
  );
}