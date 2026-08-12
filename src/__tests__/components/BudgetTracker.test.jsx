import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import BudgetTracker from '@/components/finance/BudgetTracker';
import { base44 } from '@/api/base44Client';

vi.mock('@/api/base44Client', () => ({
  base44: {
    entities: {
      BudgetCategory: { list: vi.fn() },
    },
  },
}));

vi.mock('@/lib/useMoney', () => ({
  useMoney: () => ({ money: (n) => `$${n}` }),
}));

describe('BudgetTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders budget categories with progress', async () => {
    base44.entities.BudgetCategory.list.mockResolvedValue([
      { id: '1', label: 'Groceries', category: 'groceries', spent: 800, limit: 1000 },
      { id: '2', label: 'Housing', category: 'housing', spent: 1900, limit: 2000 },
    ]);

    render(<BudgetTracker />);

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });

    expect(screen.getByText('$800 / $1000')).toBeInTheDocument();
    expect(screen.getByText('80% used')).toBeInTheDocument();
    expect(screen.getByText('95% used')).toBeInTheDocument();
  });

  it('shows over budget indicator', async () => {
    base44.entities.BudgetCategory.list.mockResolvedValue([
      { id: '1', label: 'Entertainment', category: 'entertainment', spent: 550, limit: 500 },
    ]);

    render(<BudgetTracker />);

    await waitFor(() => {
      expect(screen.getByText(/over budget/)).toBeInTheDocument();
    });
  });

  it('handles empty category list', async () => {
    base44.entities.BudgetCategory.list.mockResolvedValue([]);
    render(<BudgetTracker />);
    await waitFor(() => {
      expect(screen.getByText('Budget Tracker')).toBeInTheDocument();
    });
  });
});
