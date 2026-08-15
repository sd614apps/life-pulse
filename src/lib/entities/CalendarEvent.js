import { BaseEntity } from './BaseEntity';

class CalendarEventEntity extends BaseEntity {
  constructor() {
    super('calendar_events', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      category: 'family',
      duration_minutes: 60,
      ...record,
    };

    const required = ['title', 'event_at', 'category'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[CalendarEvent.create] Field "${field}" is required.`);
      }
    }

    const validCategories = ['family', 'health', 'school', 'work', 'travel'];
    if (!validCategories.includes(payload.category)) {
      throw new Error(
        `[CalendarEvent.create] Invalid category "${payload.category}". Allowed: ${validCategories.join(', ')}`
      );
    }

    if (typeof payload.duration_minutes !== 'number') {
      payload.duration_minutes = Number(payload.duration_minutes) || 60;
    }

    return super.create(payload);
  }
}

export const CalendarEvent = new CalendarEventEntity();