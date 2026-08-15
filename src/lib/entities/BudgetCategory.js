import { BaseEntity } from './BaseEntity';

class BudgetCategoryEntity extends BaseEntity {
  constructor() {
    super('budget_categories', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      category: 'housing',
      spent: 0,
      ...record,
    };

    const required = ['category', 'label', 'limit', 'spent'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[BudgetCategory.create] Field "${field}" is required.`);
      }
    }

    const validCategories = [
      'housing',
      'groceries',
      'utilities',
      'entertainment',
      'healthcare',
    ];
    if (!validCategories.includes(payload.category)) {
      throw new Error(
        `[BudgetCategory.create] Invalid category "${payload.category}". Allowed: ${validCategories.join(', ')}`
      );
    }

    if (typeof payload.limit !== 'number' || typeof payload.spent !== 'number') {
      throw new Error('[BudgetCategory.create] "limit" and "spent" must be valid numbers.');
    }

    return super.create(payload);
  }
}

export const BudgetCategory = new BudgetCategoryEntity();