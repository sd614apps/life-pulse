import { BaseEntity } from './BaseEntity';

class TripEventEntity extends BaseEntity {
  constructor() {
    super('trip_events', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      type: 'activity',
      ...record,
    };

    const required = ['trip_id', 'title', 'type', 'event_date'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[TripEvent.create] Field "${field}" is required.`);
      }
    }

    const validTypes = ['flight', 'hotel', 'activity', 'transport', 'other'];
    if (!validTypes.includes(payload.type)) {
      throw new Error(
        `[TripEvent.create] Invalid type "${payload.type}". Allowed: ${validTypes.join(', ')}`
      );
    }

    return super.create(payload);
  }

  /**
   * Helper to fetch events for a specific trip ordered chronologically
   */
  async listByTrip(tripId) {
    return this.list({
      filter: { trip_id: tripId },
      orderBy: 'event_date:asc',
    });
  }
}

export const TripEvent = new TripEventEntity();