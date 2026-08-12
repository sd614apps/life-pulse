import { describe, it, expect } from 'vitest';
import {
  getExpiryDays,
  getExpiryStatus,
  sortDocumentsByExpiry,
  isTravelDocAlert,
  travelDocAlertSeverity,
  SOON_DAYS,
  CRITICAL_DAYS,
} from '@/lib/travel/expiryStatus';

const NOW = new Date('2026-08-12T12:00:00Z');

describe('expiryStatus', () => {
  describe('getExpiryDays', () => {
    it('computes days until expiry', () => {
      expect(getExpiryDays('2026-09-12', NOW)).toBe(31);
    });

    it('returns negative for expired documents', () => {
      expect(getExpiryDays('2026-07-01', NOW)).toBeLessThan(0);
    });
  });

  describe('getExpiryStatus', () => {
    it('flags soon and critical windows', () => {
      const soon = getExpiryStatus('2026-12-01', NOW);
      expect(soon.soon).toBe(true);
      expect(soon.critical).toBe(false);

      const critical = getExpiryStatus('2026-09-01', NOW);
      expect(critical.soon).toBe(true);
      expect(critical.critical).toBe(true);
    });

    it('marks expired documents', () => {
      const status = getExpiryStatus('2026-01-01', NOW);
      expect(status.expired).toBe(true);
      expect(status.label).toBe('Expired');
    });
  });

  describe('sortDocumentsByExpiry', () => {
    it('sorts by earliest expiry first', () => {
      const docs = [
        { id: 'b', expiry_date: '2027-01-01' },
        { id: 'a', expiry_date: '2026-06-01' },
      ];
      expect(sortDocumentsByExpiry(docs).map((d) => d.id)).toEqual(['a', 'b']);
    });
  });

  describe('isTravelDocAlert', () => {
    it('alerts within 180 days', () => {
      expect(isTravelDocAlert('2026-12-01', NOW)).toBe(true);
      expect(isTravelDocAlert('2027-06-01', NOW)).toBe(false);
    });

    it('does not alert for expired docs', () => {
      expect(isTravelDocAlert('2026-01-01', NOW)).toBe(false);
    });
  });

  describe('travelDocAlertSeverity', () => {
    it('uses critical within 60 days', () => {
      expect(travelDocAlertSeverity('2026-09-01', NOW)).toBe('critical');
    });

    it('uses pending between 61 and 180 days', () => {
      expect(travelDocAlertSeverity('2026-12-01', NOW)).toBe('pending');
    });

    it('returns null outside alert window', () => {
      expect(travelDocAlertSeverity('2027-06-01', NOW)).toBe(null);
    });
  });

  it('exports expected threshold constants', () => {
    expect(SOON_DAYS).toBe(180);
    expect(CRITICAL_DAYS).toBe(60);
  });
});
