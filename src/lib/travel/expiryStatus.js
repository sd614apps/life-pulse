import { differenceInCalendarDays, parseISO } from 'date-fns';

export const SOON_DAYS = 180;
export const CRITICAL_DAYS = 60;

export function getExpiryDays(expiryDate, now = new Date()) {
  return differenceInCalendarDays(parseISO(expiryDate), now);
}

export function getExpiryStatus(expiryDate, now = new Date()) {
  const days = getExpiryDays(expiryDate, now);
  const soon = days <= SOON_DAYS;
  const critical = days <= CRITICAL_DAYS;
  const expired = days < 0;
  return {
    days,
    soon,
    critical,
    expired,
    label: expired ? 'Expired' : `In ${days}d`,
  };
}

export function sortDocumentsByExpiry(docs) {
  return [...docs].sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date));
}

export function isTravelDocAlert(expiryDate, now = new Date()) {
  const days = getExpiryDays(expiryDate, now);
  return days >= 0 && days <= SOON_DAYS;
}

export function travelDocAlertSeverity(expiryDate, now = new Date()) {
  const days = getExpiryDays(expiryDate, now);
  if (days < 0 || days > SOON_DAYS) return null;
  return days <= CRITICAL_DAYS ? 'critical' : 'pending';
}
