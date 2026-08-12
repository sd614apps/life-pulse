import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Smartphone, Accessibility } from 'lucide-react';

const STORIES = [
  {
    icon: Smartphone,
    name: 'Maya, 19',
    role: 'Tech-savvy student',
    quote:
      'I manage my budget, investments, and travel plans in one place. The passkey login is instant and I never worry about who can see what.',
  },
  {
    icon: Accessibility,
    name: 'Robert, 71',
    role: 'Retired grandfather',
    quote:
      'The Simplified View and Large Text Mode mean I can finally read everything clearly. My daughter set up my access in minutes — I see only what I need.',
  },
];

export default function Testimonials() {
  return (
    <section className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">Built for every generation</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Powerful for the young, effortless for the wise
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {STORIES.map((s, i) => (
            <motion.figure
              key={s.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative rounded-2xl border border-border/70 bg-card p-8"
            >
              <Quote className="h-8 w-8 text-brand/30" />
              <blockquote className="mt-4 text-lg leading-relaxed text-foreground">
                “{s.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{s.name}</div>
                  <div className="text-sm text-muted-foreground">{s.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}