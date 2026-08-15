import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResetButton() {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const reset = async () => {
    if (
      !confirm(
        'Reset all seed metrics to baseline? This replaces current financial, health, investment, and notification data.'
      )
    ) {
      return;
    }

    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('resetSeedData', {
        body: {},
      });

      if (error) throw error;

      toast({
        title: `Seed data reset · ${data?.recreated ?? 0} records restored`,
      });
    } catch (err) {
      console.error('[ResetButton.reset]', err);
      toast({
        title: 'Reset failed',
        description: err.message || 'Failed to reset seed data.',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      onClick={reset}
      disabled={busy}
      variant="outline"
      className="gap-2"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RotateCcw className="h-4 w-4" />
      )}
      {busy ? 'Resetting…' : 'Reset Seed Data'}
    </Button>
  );
}