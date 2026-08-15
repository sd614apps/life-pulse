import { BaseEntity } from './BaseEntity';

class TripEntity extends BaseEntity {
  constructor() {
    super('trips', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      status: 'upcoming',
      ...record,
    };

    const required = ['title', 'destination', 'start_date', 'status'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[Trip.create] Field "${field}" is required.`);
      }
    }

    const validStatuses = ['upcoming', 'past', 'bucket_list'];
    if (!validStatuses.includes(payload.status)) {
      throw new Error(
        `[Trip.create] Invalid status "${payload.status}". Allowed: ${validStatuses.join(', ')}`
      );
    }

    return super.create(payload);
  }
}

export const Trip = new TripEntity();