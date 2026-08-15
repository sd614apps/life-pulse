import { BaseEntity } from './BaseEntity';

class VaultItemEntity extends BaseEntity {
  constructor() {
    super('vault_items', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      category: 'legal',
      encrypted: true,
      uploaded_at: new Date().toISOString().split('T')[0],
      ...record,
    };

    const required = ['title', 'category', 'uploaded_at'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[VaultItem.create] Field "${field}" is required.`);
      }
    }

    const validCategories = ['insurance', 'medical', 'property', 'id', 'legal'];
    if (!validCategories.includes(payload.category)) {
      throw new Error(
        `[VaultItem.create] Invalid category "${payload.category}". Allowed: ${validCategories.join(', ')}`
      );
    }

    if (typeof payload.encrypted !== 'boolean') {
      payload.encrypted = Boolean(payload.encrypted);
    }

    return super.create(payload);
  }
}

export const VaultItem = new VaultItemEntity();