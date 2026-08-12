export const DEFAULT_COLORS = {
  housing: '#0ea5e9',
  groceries: '#10b981',
  utilities: '#f59e0b',
  entertainment: '#8b5cf6',
  healthcare: '#ef4444',
};

export function calcBudgetPct(spent, limit) {
  if (!limit || limit <= 0) return 0;
  return Math.min(100, Math.round((spent / limit) * 100));
}

export function isOverBudget(spent, limit) {
  return spent > limit;
}

export function resolveCategoryColor(category, customColor) {
  return customColor || DEFAULT_COLORS[category] || '#64748b';
}

export function isBudgetAlert(spent, limit, threshold = 0.8) {
  if (!limit || limit <= 0) return false;
  const ratio = spent / limit;
  return ratio >= threshold;
}

export function budgetAlertSeverity(spent, limit) {
  if (!limit || limit <= 0) return null;
  const ratio = spent / limit;
  if (ratio >= 1) return 'critical';
  if (ratio >= 0.8) return 'pending';
  return null;
}
