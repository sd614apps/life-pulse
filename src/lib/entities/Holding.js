import { BaseEntity } from './BaseEntity';

class HoldingEntity extends BaseEntity {
  constructor() {
    super('holdings', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      asset_class: 'stocks_etfs',
      risk_level: 'medium',
      daily_change_amount: 0,
      daily_change_pct: 0,
      ...record,
    };

    const required = ['asset_name', 'asset_class', 'balance', 'risk_level'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[Holding.create] Field "${field}" is required.`);
      }
    }

    const validAssetClasses = ['stocks_etfs', 'real_estate', 'crypto', 'retirement', 'cash'];
    if (!validAssetClasses.includes(payload.asset_class)) {
      throw new Error(
        `[Holding.create] Invalid asset_class "${payload.asset_class}". Allowed: ${validAssetClasses.join(', ')}`
      );
    }

    const validRiskLevels = ['low', 'medium', 'high'];
    if (!validRiskLevels.includes(payload.risk_level)) {
      throw new Error(
        `[Holding.create] Invalid risk_level "${payload.risk_level}". Allowed: ${validRiskLevels.join(', ')}`
      );
    }

    if (typeof payload.balance !== 'number') {
      payload.balance = Number(payload.balance);
    }
    if (typeof payload.daily_change_amount !== 'number') {
      payload.daily_change_amount = Number(payload.daily_change_amount) || 0;
    }
    if (typeof payload.daily_change_pct !== 'number') {
      payload.daily_change_pct = Number(payload.daily_change_pct) || 0;
    }

    return super.create(payload);
  }
}

export const Holding = new HoldingEntity();