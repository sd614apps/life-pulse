import React, { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ActionCenter from '@/components/dashboard/ActionCenter';
import QuickAddButton from '@/components/dashboard/QuickAddButton';
import HealthTile from '@/components/dashboard/tiles/HealthTile';
import FinanceTile from '@/components/dashboard/tiles/FinanceTile';
import InvestmentTile from '@/components/dashboard/tiles/InvestmentTile';
import TravelTile from '@/components/dashboard/tiles/TravelTile';
import FamilyTile from '@/components/dashboard/tiles/FamilyTile';
import VaultTile from '@/components/dashboard/tiles/VaultTile';
import { useFeatureToggles } from '@/lib/useFeatureToggles';

export default function Dashboard() {
  const { isEnabled } = useFeatureToggles();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.functions.invoke('syncAlertNotifications', {}).catch((err) => {
      console.error('[Dashboard.syncAlertNotifications]', err);
    });
  }, []);

  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data: { user }, error }) => {
        if (error || !user) return;

        const isAdmin =
          user.role === 'admin' ||
          user.app_metadata?.role === 'admin' ||
          user.user_metadata?.role === 'admin';

        if (!isAdmin && user.user_metadata?.onboarding_complete !== true) {
          navigate('/onboarding');
        }
      })
      .catch((err) => {
        console.error('[Dashboard.getUser]', err);
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <ActionCenter />

        <section aria-label="Overview" className="mt-6">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground">Overview</h2>
            <p className="text-xs text-muted-foreground">Tap any tile to dive deeper</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {isEnabled('health') && <HealthTile />}
            {isEnabled('finance') && <FinanceTile />}
            {isEnabled('investment') && <InvestmentTile />}
            {isEnabled('travel') && <TravelTile />}
            {isEnabled('family') && <FamilyTile />}
            {isEnabled('vault') && <VaultTile />}
          </div>
        </section>
      </main>
      <QuickAddButton />
    </div>
  );
}