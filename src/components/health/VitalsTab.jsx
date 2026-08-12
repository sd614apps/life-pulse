import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { format, parseISO } from 'date-fns';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { HeartPulse, Activity, Footprints, Droplet } from 'lucide-react';
import LogVitalsDialog from './LogVitalsDialog';

const METRICS = [
  { key: 'blood_pressure', label: 'Blood Pressure', icon: HeartPulse, color: '#ef4444', unit: 'mmHg' },
  { key: 'heart_rate', label: 'Heart Rate', icon: Activity, color: '#0ea5e9', unit: 'bpm' },
  { key: 'steps', label: 'Daily Steps', icon: Footprints, color: '#10b981', unit: 'steps' },
  { key: 'blood_sugar', label: 'Blood Sugar', icon: Droplet, color: '#8b5cf6', unit: 'mg/dL' },
];

function ChartCard({ metric, data }) {
  const latest = data.length ? data[data.length - 1] : null;
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${metric.color}1a`, color: metric.color }}>
            <metric.icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-foreground">{metric.label}</span>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-foreground">
            {metric.key === 'blood_pressure'
              ? latest ? `${latest.value}/${latest.diastolic}` : '—'
              : latest ? latest.value : '—'}
          </div>
          <div className="text-[11px] text-muted-foreground">{metric.unit}</div>
        </div>
      </div>
      <div className="mt-3 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          {metric.key === 'steps' ? (
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -28 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={44} />
              <Tooltip />
              <Bar dataKey="value" fill={metric.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : metric.key === 'blood_pressure' ? (
            <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -28 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={44} />
              <Tooltip />
              <Line type="monotone" dataKey="value" name="Systolic" stroke={metric.color} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -28 }}>
              <defs>
                <linearGradient id={`g-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={metric.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={44} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke={metric.color} strokeWidth={2} fill={`url(#g-${metric.key})`} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function VitalsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const list = await base44.entities.HealthLog.list('-logged_at', 100);
      setItems(list || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const chartData = useMemo(() => {
    const byMetric = {};
    METRICS.forEach((m) => { byMetric[m.key] = []; });
    items.filter((it) => it.status === 'logged').forEach((it) => {
      if (byMetric[it.metric_type]) {
        byMetric[it.metric_type].push({
          date: format(parseISO(it.logged_at), 'MM/dd'),
          value: it.value,
          diastolic: it.secondary_value,
          sortKey: new Date(it.logged_at).getTime(),
        });
      }
    });
    Object.values(byMetric).forEach((arr) => arr.sort((a, b) => a.sortKey - b.sortKey));
    return byMetric;
  }, [items]);

  const recent = useMemo(() => items.slice(0, 8), [items]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-muted-foreground">Quick log — large buttons</h2>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className="flex min-h-[68px] flex-col items-start gap-1 rounded-xl border border-border/70 bg-card p-4 text-left transition-colors hover:border-brand/50 hover:bg-brand-soft"
            >
              <m.icon className="h-5 w-5" style={{ color: m.color }} />
              <span className="text-sm font-semibold text-foreground">Log {m.label}</span>
              <span className="text-xs text-muted-foreground">Tap to add a reading</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-muted-foreground">Loading vitals…</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {METRICS.map((m) => (
            <ChartCard key={m.key} metric={m} data={chartData[m.key]} />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground">Daily logs</h3>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No logs yet. Use the buttons above to record a reading.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border/60">
            {recent.map((it) => {
              const m = METRICS.find((x) => x.key === it.metric_type);
              const display = it.metric_type === 'blood_pressure' ? `${it.value}/${it.secondary_value}` : it.value;
              return (
                <li key={it.id} className="flex items-center gap-3 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${m?.color}1a`, color: m?.color }}>
                    {m && <m.icon className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">{m?.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {it.member_name} · {format(parseISO(it.logged_at), 'd MMM yyyy, h:mm a')}
                    </div>
                  </div>
                  <span className="ml-auto text-sm font-semibold text-foreground">
                    {display} <span className="text-xs font-normal text-muted-foreground">{m?.unit}</span>
                  </span>
                  {it.status === 'upcoming' && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600">Upcoming</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <LogVitalsDialog
        metric={metric}
        open={!!metric}
        onOpenChange={(o) => !o && setMetric(null)}
        onLogged={load}
      />
    </div>
  );
}