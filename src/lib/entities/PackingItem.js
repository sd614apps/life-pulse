import { BaseEntity } from './BaseEntity';
import { supabase } from '../supabaseClient';

class PackingItemEntity extends BaseEntity {
  constructor() {
    super('packing_items', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      packed: false,
      ...record,
    };

    const required = ['trip_id', 'item', 'packed'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[PackingItem.create] Field "${field}" is required.`);
      }
    }

    if (typeof payload.packed !== 'boolean') {
      payload.packed = Boolean(payload.packed);
    }

    return super.create(payload);
  }

  /**
   * Helper to fetch all packing items for a specific trip
   */
  async listByTrip(tripId) {
    return this.list({ filter: { trip_id: tripId } });
  }

  /**
   * Helper to toggle packed status
   */
  async setPackedStatus(id, packed) {
    return this.update(id, { packed: Boolean(packed) });
  }
}

export const PackingItem = new PackingItemEntity();