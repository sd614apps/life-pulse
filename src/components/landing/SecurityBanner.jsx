import React from 'react';
import { Lock, Users, ShieldCheck, KeyRound } from 'lucide-react';

const ITEMS = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    desc: 'Every record is encrypted on your device before it ever touches our servers.',
  },
  {
    icon: Users,
    title: 'Role-Based Family Access',
    desc: 'Grant each family member exactly the access they need — nothing more.',
  },
  {
    icon: KeyRound,
    title: 'Multi-Factor Authentication',
    desc: 'Passkeys, biometrics, and one-time codes keep sign-ins airtight.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero-Knowledge Architecture',
    desc: 'We can never read your data — only you hold the keys.',
  },
];

export default function SecurityBanner() {
  return (
    <section className="border-y border-border/70 bg-card/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}