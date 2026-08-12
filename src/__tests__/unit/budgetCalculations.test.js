import { describe, it, expect } from 'vitest';
import {
  calcBudgetPct,
  isOverBudget,
  resolveCategoryColor,
  isBudgetAlert,
  budgetAlertSeverity,
  DEFAULT_COLORS,
} from '@/lib/finance/budgetCalculations';

describe('budgetCalculations', () => {
  describe('calcBudgetPct', () => {
    it('calculates percentage capped at 100', () => {
      expect(calcBudgetPct(800, 1000)).toBe(80);
      expect(calcBudgetPct(1200, 1000)).toBe(100);
    });

    it('returns 0 when limit is zero or negative', () => {
      expect(calcBudgetPct(500, 0)).toBe(0);
      expect(calcBudgetPct(500, -100)).toBe(0);
    });
  });

  describe('isOverBudget', () => {
    it('detects over-budget spending', () => {
      expect(isOverBudget(1100, 1000)).toBe(true);
      expect(isOverBudget(900, 1000)).toBe(false);
    });
  });

  describe('resolveCategoryColor', () => {
    it('uses custom color when provided', () => {
      expect(resolveCategoryColor('housing', '#ff0000')).toBe('#ff0000');
    });

    it('falls back to default category colors', () => {
      expect(resolveCategoryColor('groceries')).toBe(DEFAULT_COLORS.groceries);
    });

    it('uses slate fallback for unknown categories', () => {
      expect(resolveCategoryColor('unknown')).toBe('#64748b');
    });
  });

  describe('isBudgetAlert', () => {
    it('triggers at 80% threshold', () => {
      expect(isBudgetAlert(800, 1000)).toBe(true);
      expect(isBudgetAlert(790, 1000)).toBe(false);
    });

    it('ignores zero limit categories', () => {
      expect(isBudgetAlert(500, 0)).toBe(false);
    });
  });

  describe('budgetAlertSeverity', () => {
    it('returns critical at or above 100%', () => {
      expect(budgetAlertSeverity(1000, 1000)).toBe('critical');
      expect(budgetAlertSeverity(1100, 1000)).toBe('critical');
    });

    it('returns pending between 80% and 100%', () => {
      expect(budgetAlertSeverity(850, 1000)).toBe('pending');
    });

    it('returns null below threshold', () => {
      expect(budgetAlertSeverity(500, 1000)).toBe(null);
    });
  });
});
