import { useLocale } from '@/lib/LocaleContext';
import { useAccessibility } from '@/lib/AccessibilityContext';

export function useMoney() {
  const { privacyMode } = useAccessibility();
  const { formatCurrency } = useLocale();
  const money = (n) => formatCurrency(n);
  return { money, privacyMode };
}