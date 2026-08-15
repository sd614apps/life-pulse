import { BaseEntity } from './BaseEntity';

class FamiliesEntity extends BaseEntity {
  constructor() {
    super('families', { attachUserId: true });
  }

  async create(record) {
    const payload = { ...record };

    if (!payload.name || payload.name.trim() === '') {
      throw new Error('[Families.create] Field "name" is required.');
    }

    return super.create(payload);
  }
}

export const Families = new FamiliesEntity();