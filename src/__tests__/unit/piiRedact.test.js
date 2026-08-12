import { describe, it, expect } from 'vitest';
import { redactPII } from '@/lib/piiRedact';

describe('redactPII', () => {
  it('returns empty string for falsy input', () => {
    expect(redactPII('')).toBe('');
    expect(redactPII(null)).toBe('');
    expect(redactPII(undefined)).toBe('');
  });

  it('redacts SSN', () => {
    expect(redactPII('SSN: 123-45-6789')).toBe('SSN: [SSN]');
  });

  it('redacts email addresses', () => {
    expect(redactPII('Contact me at user@example.com')).toBe('Contact me at [EMAIL]');
  });

  it('redacts phone numbers', () => {
    expect(redactPII('Call (555) 123-4567 today')).toBe('Call [PHONE] today');
  });

  it('redacts long digit runs', () => {
    expect(redactPII('Account 123456789012')).toBe('Account [ACCOUNT]');
  });

  it('redacts financial account mentions', () => {
    expect(redactPII('$2,450 at Chase Bank')).toBe('[FINANCIAL_ACCOUNT]');
  });

  it('redacts street addresses', () => {
    expect(redactPII('Lives at 123 Main Street')).toBe('Lives at [ADDRESS]');
  });

  it('leaves non-PII text unchanged', () => {
    const safe = 'Budget is at 75% for groceries this month.';
    expect(redactPII(safe)).toBe(safe);
  });

  it('handles multiple PII types in one string', () => {
    const result = redactPII('Email user@test.com, phone 555-123-4567, SSN 111-22-3333');
    expect(result).toContain('[EMAIL]');
    expect(result).toContain('[PHONE]');
    expect(result).toContain('[SSN]');
  });
});
