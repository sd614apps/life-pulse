import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useAccessibility } from '@/lib/AccessibilityContext';
import { differenceInCalendarDays, parseISO } from 'date-fns';

const LocaleContext = createContext(null);
const STORAGE_KEY = 'lp-region-prefs';

const COUNTRY_CURRENCY = {
  US: 'USD', IN: 'INR', GB: 'GBP', JP: 'JPY', CA: 'CAD', AU: 'AUD',
  DE: 'EUR', FR: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR', IE: 'EUR', PT: 'EUR',
  BR: 'BRL', MX: 'MXN', CN: 'CNY', SG: 'SGD', HK: 'HKD', AE: 'AED', ZA: 'ZAR',
  CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', TR: 'TRY', KR: 'KRW',
};
const IMPERIAL_COUNTRIES = ['US', 'LR', 'MM'];

function detect() {
  const lang = navigator.language || 'en-US';
  const region = (lang.split('-')[1] || 'US').toUpperCase();
  return {
    locale: lang,
    region,
    currency: COUNTRY_CURRENCY[region] || 'USD',
    unitSystem: IMPERIAL_COUNTRIES.includes(region) ? 'imperial' : 'metric',
    dateFormat: region === 'US' ? 'MM/DD/YYYY' : 'DD/MM/YYYY',
    timeFormat: region === 'US' ? '12' : '24',
  };
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function LocaleProvider({ children }) {
  const { privacyMode } = useAccessibility();
  const [settings, setSettings] = useState(() => readStored() || detect());

  useEffect(() => {
    let mounted = true;
    base44.auth.me().then((u) => {
      if (u?.data?.region_prefs && mounted) {
        setSettings((prev) => ({ ...prev, ...u.data.region_prefs }));
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const saveSettings = useCallback((partial) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      base44.auth.updateMe({ data: { region_prefs: next } }).catch(() => {});
      return next;
    });
  }, []);

  const locale = settings.locale || 'en-US';
  const currency = settings.currency || 'USD';

  const formatCurrency = useCallback((n) => {
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
    }).format(Number(n) || 0);
    if (privacyMode) return formatted.replace(/[0-9]/g, '•').replace(/[,.]/g, '').replace(/\s/g, '');
    return formatted;
  }, [locale, currency, privacyMode]);

  const formatNumber = useCallback((n) => new Intl.NumberFormat(locale).format(Number(n) || 0), [locale]);

  const datePattern = settings.dateFormat === 'YYYY-MM-DD' ? 'yyyy-MM-dd'
    : settings.dateFormat === 'DD/MM/YYYY' ? 'dd/MM/yyyy' : 'MM/dd/yyyy';

  const formatDate = useCallback((d) => {
    const date = typeof d === 'string' ? parseISO(d) : new Date(d);
    if (isNaN(date)) return '';
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return datePattern.replace('yyyy', yyyy).replace('MM', mm).replace('dd', dd);
  }, [datePattern]);

  const formatTime = useCallback((d) => {
    const date = typeof d === 'string' ? new Date(d) : new Date(d);
    if (isNaN(date)) return '';
    const h = date.getHours();
    const m = String(date.getMinutes()).padStart(2, '0');
    if (settings.timeFormat === '24') return `${String(h).padStart(2, '0')}:${m}`;
    const ap = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 || 12;
    return `${hh}:${m} ${ap}`;
  }, [settings.timeFormat]);

  const formatDue = useCallback((d) => {
    const date = typeof d === 'string' ? parseISO(d) : new Date(d);
    if (isNaN(date)) return '';
    const now = new Date();
    const diffD = differenceInCalendarDays(date, now);
    const diffH = Math.round((date - now) / 36e5);
    const exact = formatDate(date);
    if (diffD >= 1) return `Due in ${diffD} day${diffD === 1 ? '' : 's'} (${exact})`;
    if (diffH >= 1) return `Due in ${diffH} hour${diffH === 1 ? '' : 's'} (${exact})`;
    if (diffD === 0 && diffH >= 0) return `Due today (${exact})`;
    if (diffD <= -1) return `Overdue by ${Math.abs(diffD)} day${Math.abs(diffD) === 1 ? '' : 's'} (${exact})`;
    return `Overdue by ${Math.abs(diffH)} hour${Math.abs(diffH) === 1 ? '' : 's'} (${exact})`;
  }, [formatDate]);

  const formatWeight = useCallback((kg) => {
    const v = Number(kg) || 0;
    return settings.unitSystem === 'imperial' ? `${Math.round(v * 2.20462)} lbs` : `${v} kg`;
  }, [settings.unitSystem]);

  const formatTemperature = useCallback((c) => {
    const v = Number(c) || 0;
    return settings.unitSystem === 'imperial' ? `${(v * 9 / 5 + 32).toFixed(1)}°F` : `${v}°C`;
  }, [settings.unitSystem]);

  const formatDistance = useCallback((km) => {
    const v = Number(km) || 0;
    return settings.unitSystem === 'imperial' ? `${(v * 0.621371).toFixed(1)} mi` : `${v} km`;
  }, [settings.unitSystem]);

  const value = {
    settings, saveSettings,
    locale, currency,
    formatCurrency, formatNumber, formatDate, formatTime, formatDue,
    formatWeight, formatTemperature, formatDistance,
  };
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}