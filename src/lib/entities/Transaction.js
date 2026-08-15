// src/lib/entities/Transaction.js
import { BaseEntity } from './BaseEntity';

class TransactionEntity extends BaseEntity {
  constructor() {
    super('transactions');
  }

  async create(record) {
    const payload = {
      category: 'other',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      ...record
    };

    const required = ['description', 'amount', 'category', 'type', 'date'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[Transaction.create] Field "${field}" is required.`);
      }
    }

    return super.create(payload);
  }
}

export const Transaction = new TransactionEntity();