import React from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import OverviewBar from '@/components/finance/OverviewBar';
import BudgetTracker from '@/components/finance/BudgetTracker';
import TransactionHistory from '@/components/finance/TransactionHistory';
import { Wallet } from 'lucide-react';

export default function Finance() {
  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={Wallet} title="Finances" description="Cash flow, budgets & transactions" cover="https://media.base44.com/images/public/6a737f97d9e3ddd06cf02735/7251f2013_generated_image.png" />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <OverviewBar />
        <BudgetTracker />
        <TransactionHistory />
      </main>
    </div>
  );
}