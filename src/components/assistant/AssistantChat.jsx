import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Mic, Sparkles, Lock, Maximize2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useAccessibility } from '@/lib/AccessibilityContext';
import { redactPII } from '@/lib/piiRedact';
import AssistantCards from './AssistantCards';

const CHIPS = [
  { label: 'Summarize monthly spending', cap: 'query_finance_spending' },
  { label: 'Check upcoming medication schedule', cap: 'query_health_meds' },
  { label: 'Show passport expiration dates', cap: 'query_travel_next' },
  { label: "What's on the family calendar?", cap: 'query_family_events' },
];

function detectCapability(text) {
  const t = text.toLowerCase();
  if (/(add|schedule|book).*(appointment|doctor|visit)|doctor.*next|set up.*appointment/.test(t)) return 'action';
  if (/(log|spent|spend|expense|paid).*\$|\bexpense\b|\btransaction\b/.test(t)) return 'action';
  if (/\bsnooze\b/.test(t)) return 'action';
  return 'chat';
}

export default function AssistantChat() {
  const { privacyMode } = useAccessibility();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      role: 'assistant',
      content: "Hi! I'm your LifePulse Assistant. Ask me about your spending, medications, trips, or family calendar — or tap a quick action below.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(async (text, cap) => {
    const content = (text || '').trim();
    if (!content || loading) return;

    const redacted = redactPII(content);
    const userMsgId = crypto.randomUUID();

    const history = messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { id: userMsgId, role: 'user', content: redacted }]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('lifePulseAssistant', {
        body: {
          message: redacted,
          capability: cap || detectCapability(content),
          history,
        },
      });

      if (error) throw error;

      const payload = data || {};
      const next = [];

      if (payload.reply) {
        next.push({ id: crypto.randomUUID(), role: 'assistant', content: payload.reply });
      }
      if (payload.card) {
        next.push({ id: crypto.randomUUID(), role: 'card', card: payload.card });
      }
      if (payload.action) {
        next.push({ id: crypto.randomUUID(), role: 'card', action: payload.action });
      }
      if (!next.length) {
        next.push({ id: crypto.randomUUID(), role: 'assistant', content: 'Sorry, I could not process that.' });
      }

      setMessages((prev) => [...prev, ...next]);
    } catch (err) {
      console.error('[AssistantChat.send]', err);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: 'Sorry, I had trouble reaching the server. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  const voiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript;
      if (transcript) setInput(transcript);
    };

    rec.start();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border/70 bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">LifePulse Assistant</p>
            <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <Lock className="h-3 w-3" /> Private Mode Active — PII Redacted{privacyMode ? ' · Numbers Masked' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/assistant')}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Open full page"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background p-4">
        {messages.map((m) => {
          if (m.role === 'card') {
            return <AssistantCards key={m.id} card={m.card} action={m.action} />;
          }
          const mine = m.role === 'user';
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  mine ? 'bg-brand text-brand-foreground' : 'border border-border/70 bg-card text-foreground'
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-border/70 bg-card px-3.5 py-2.5 text-sm text-muted-foreground">
              Thinking…
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto border-t border-border/70 bg-card px-3 py-2">
        {CHIPS.map((c) => (
          <button
            key={c.cap}
            onClick={() => send(c.label, c.cap)}
            className="whitespace-nowrap rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-brand/40"
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-border/70 bg-card p-3">
        <button
          onClick={voiceInput}
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border ${
            listening
              ? 'border-red-500 text-red-500 animate-pulse'
              : 'border-border/70 text-muted-foreground hover:text-foreground'
          }`}
          aria-label="Voice input"
        >
          <Mic className="h-4 w-4" />
        </button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Ask anything…"
          className="h-10 flex-1"
        />
        <Button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="h-10 w-10 p-0"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}