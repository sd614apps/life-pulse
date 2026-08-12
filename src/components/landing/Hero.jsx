import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero({ onGetStarted, onSignIn, primaryLabel = 'Get Started', secondaryLabel = 'Sign In' }) {
  return (
    <section className="relative overflow-hidden lp-hero-gradient">
      <div className="absolute inset-0 lp-grid-bg" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 sm:pt-28 sm:pb-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex max-w-3xl flex-col items-start"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            <ShieldCheck className="h-4 w-4" />
            Zero-Knowledge · End-to-End Encrypted
          </span>

          <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl">
            Your Entire Life,
            <span className="block text-brand">Securely Organized in One Place.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            LifePulse unifies your health, finances, investments, travel, and family into a single
            private hub — designed for every generation, from tech-savvy teens to grandparents.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="min-h-[52px] gap-2 rounded-full bg-brand px-7 text-base text-brand-foreground hover:bg-brand/90"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onSignIn}
              className="min-h-[52px] rounded-full border-foreground/20 px-7 text-base"
            >
              {secondaryLabel}
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
            <Activity className="h-4 w-4 text-brand" />
            Trusted by multi-generational families across 30+ countries
          </div>
        </motion.div>
      </div>
    </section>
  );
}