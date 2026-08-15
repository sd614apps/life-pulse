import { BaseEntity } from './BaseEntity';

class NetWorthPointEntity extends BaseEntity {
  constructor() {
    super('net_worth_points', { attachUserId: true });
  }

  async create(record) {
    const payload = { ...record };

    const required = ['month', 'assets', 'liabilities'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[NetWorthPoint.create] Field "${field}" is required.`);
      }
    }

    if (typeof payload.assets !== 'number') {
      payload.assets = Number(payload.assets);
    }
    if (typeof payload.liabilities !== 'number') {
      payload.liabilities = Number(payload.liabilities);
    }

    return super.create(payload);
  }
}

export const NetWorthPoint = new NetWorthPointEntity();