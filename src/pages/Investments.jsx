import React from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import NetWorthChart from '@/components/investments/NetWorthChart';
import AssetAllocation from '@/components/investments/AssetAllocation';
import HoldingsTable from '@/components/investments/HoldingsTable';
import { TrendingUp } from 'lucide-react';

export default function Investments() {
  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={TrendingUp} title="Investments & Net Worth" description="Portfolio, allocation & holdings" cover="/images/investment-tile-cover.png" />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <NetWorthChart />
        <AssetAllocation />
        <HoldingsTable />
      </main>
    </div>
  );
}