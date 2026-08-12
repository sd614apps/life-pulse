import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Wallet, TrendingUp, Plane, Home } from 'lucide-react';
import { Image } from '@/components/ui/image';

const FEATURES = [
  {
    icon: HeartPulse,
    title: 'Health',
    desc: 'Track vitals, medications, and appointments for the whole family in one private record.',
    image: 'https://media.base44.com/images/public/6a737f97d9e3ddd06cf02735/3374a2875_generated_image.png',
  },
  {
    icon: Wallet,
    title: 'Finances',
    desc: 'Budgets, accounts, and bills — with sensitive balances masked in Privacy Mode.',
    image: 'https://media.base44.com/images/public/6a737f97d9e3ddd06cf02735/7251f2013_generated_image.png',
  },
  {
    icon: TrendingUp,
    title: 'Investments',
    desc: 'Monitor portfolios and holdings with clear, real-time performance snapshots.',
    image: 'https://media.base44.com/images/public/6a737f97d9e3ddd06cf02735/22ffb0971_generated_image.png',
  },
  {
    icon: Plane,
    title: 'Travel',
    desc: 'Itineraries, documents, and reminders so no trip detail slips through the cracks.',
    image: 'https://media.base44.com/images/public/6a737f97d9e3ddd06cf02735/0b82fa3a2_generated_image.png',
  },
  {
    icon: Home,
    title: 'Family',
    desc: 'Share what matters with the right people through tiered, role-based access.',
    image: 'https://media.base44.com/images/public/6a737f97d9e3ddd06cf02735/f643c4574_generated_image.png',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">One hub, every domain</p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Everything that matters, finally together
        </h2>
        <p className="mt-4 text-muted-foreground">
          Five connected modules share one secure foundation — so your life stays coherent, not scattered.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="group relative min-h-[230px] overflow-hidden rounded-2xl border border-border/70 transition-shadow hover:shadow-xl hover:shadow-foreground/10"
          >
            <Image
              src={f.image}
              alt={f.title}
              fittingType="fill"
              className="absolute inset-0 h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/25" />
            <div className="relative flex h-full min-h-[230px] flex-col p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{f.desc}</p>
            </div>
          </motion.div>
        ))}

        <div className="flex min-h-[230px] flex-col justify-center rounded-2xl border border-dashed border-brand/40 bg-brand-soft p-7">
          <p className="text-sm font-medium text-brand">And more on the way</p>
          <p className="mt-2 text-sm text-muted-foreground">
            LifePulse grows with your family — new modules roll out without ever leaving your secure vault.
          </p>
        </div>
      </div>
    </section>
  );
}