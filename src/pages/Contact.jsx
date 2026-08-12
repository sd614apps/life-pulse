import React, { useState } from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { HelpCircle, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    toast({ title: 'Message sent', description: 'Our team will get back to you soon.' });
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={HelpCircle} title="Contact & Support" description="We're here to help" />
      <main className="mx-auto max-w-3xl px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-border/70 bg-card p-5">
              <div className="flex items-center gap-2"><Mail className="h-5 w-5 text-brand" /><h3 className="font-heading text-sm font-semibold">Email support</h3></div>
              <p className="mt-2 text-sm text-muted-foreground">Reach out via the contact form and our team will respond during business hours.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-5">
              <div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-brand" /><h3 className="font-heading text-sm font-semibold">In-app assistant</h3></div>
              <p className="mt-2 text-sm text-muted-foreground">Tap the spark icon (bottom-right) to ask the LifePulse Assistant anything, any time.</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border/70 bg-card p-5">
              <h3 className="font-heading text-base font-semibold text-foreground">Send us a message</h3>
              {sent ? (
                <div className="mt-6 flex flex-col items-center justify-center py-10 text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  <p className="mt-2 text-sm font-medium text-foreground">Thanks! Your message has been sent.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setSent(false)}>Send another</Button>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <Button type="submit" className="h-11 w-full">Send message</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}