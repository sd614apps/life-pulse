import React, { useEffect, useState } from 'react';
import { entities } from '@/lib/entities';
import { Phone, Siren, Stethoscope, Users, HeartPulse } from 'lucide-react';

const KIND_ICON = { services: Siren, doctor: Stethoscope, family: Users, ice: HeartPulse };
const KIND_LABEL = {
  services: 'Emergency Services',
  doctor: 'Family Doctor',
  family: 'Primary Contact',
  ice: 'ICE Medical Info',
};

export default function EmergencyTab() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    entities.EmergencyContact.list()
      .then((list) => setContacts(list || []))
      .catch((err) => {
        console.error('[EmergencyTab.EmergencyContact]', err);
        setContacts([]);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
        In an emergency, tap any button below to call directly from your device.
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {contacts.map((c) => {
          const Icon = KIND_ICON[c.kind] || Phone;
          return (
            <div key={c.id} className="rounded-2xl border border-border/70 bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {KIND_LABEL[c.kind] || c.label}
                  </div>
                  <div className="text-sm font-semibold text-foreground">{c.contact_name || c.label}</div>
                </div>
              </div>
              {c.info && <p className="mt-3 text-sm text-muted-foreground">{c.info}</p>}
              <a
                href={`tel:${c.phone}`}
                className="mt-4 flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-red-500 text-base font-semibold text-white transition-colors hover:bg-red-600"
              >
                <Phone className="h-5 w-5" /> Call {c.phone}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}