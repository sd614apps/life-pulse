import React from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import VaultGrid from '@/components/vault/VaultGrid';
import { ShieldCheck } from 'lucide-react';

export default function Vault() {
  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={ShieldCheck} title="Encrypted Vault" description="Secure storage for vital documents" cover="/images/vault-tile-cover.png" />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <VaultGrid />
      </main>
    </div>
  );
}