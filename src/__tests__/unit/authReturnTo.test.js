import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { safeReturnTo } from '@/lib/authReturnTo';

describe('safeReturnTo', () => {
  const originalLocation = window.location;

  function setLocation({ search = '', origin = 'http://localhost:5173', pathname = '/', hash = '' }) {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { search, origin, pathname, hash },
    });
  }

  beforeEach(() => {
    setLocation({});
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  });

  it('returns "/" when returnTo is missing', () => {
    expect(safeReturnTo()).toBe('/');
  });

  it('allows valid same-origin paths', () => {
    setLocation({ search: '?returnTo=%2Fdashboard' });
    expect(safeReturnTo()).toBe('/dashboard');
  });

  it('preserves non-bootstrap query params', () => {
    setLocation({ search: '?returnTo=%2Foauth%3Fctx%3Dabc' });
    expect(safeReturnTo()).toBe('/oauth?ctx=abc');
  });

  it('blocks cross-origin absolute URLs', () => {
    setLocation({ search: '?returnTo=https%3A%2F%2Fevil.com%2Fsteal' });
    expect(safeReturnTo()).toBe('/');
  });

  it('blocks protocol-relative open redirects', () => {
    setLocation({ search: '?returnTo=%2F%2Fevil.com' });
    expect(safeReturnTo()).toBe('/');
  });

  it('blocks backslash open redirects', () => {
    setLocation({ search: '?returnTo=%2F%5Cevil.com' });
    expect(safeReturnTo()).toBe('/');
  });

  it('strips bootstrap params from returnTo', () => {
    setLocation({ search: '?returnTo=%2Fdashboard%3Faccess_token%3Dsecret%26app_id%3Dx' });
    expect(safeReturnTo()).toBe('/dashboard');
  });

  it('returns "/" for malformed URLs', () => {
    setLocation({ search: '?returnTo=%' });
    expect(safeReturnTo()).toBe('/');
  });
});
