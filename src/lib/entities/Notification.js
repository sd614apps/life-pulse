import { BaseEntity } from './BaseEntity';

class NotificationEntity extends BaseEntity {
  constructor() {
    super('notifications', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      severity: 'pending',
      category: 'family',
      status: 'active',
      ...record,
    };

    const required = ['title', 'severity', 'category', 'status'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[Notification.create] Field "${field}" is required.`);
      }
    }

    const validSeverities = ['critical', 'pending', 'upcoming'];
    if (!validSeverities.includes(payload.severity)) {
      throw new Error(
        `[Notification.create] Invalid severity "${payload.severity}". Allowed: ${validSeverities.join(', ')}`
      );
    }

    const validCategories = ['health', 'finance', 'investment', 'travel', 'family', 'vault'];
    if (!validCategories.includes(payload.category)) {
      throw new Error(
        `[Notification.create] Invalid category "${payload.category}". Allowed: ${validCategories.join(', ')}`
      );
    }

    const validStatuses = ['active', 'completed', 'snoozed'];
    if (!validStatuses.includes(payload.status)) {
      throw new Error(
        `[Notification.create] Invalid status "${payload.status}". Allowed: ${validStatuses.join(', ')}`
      );
    }

    return super.create(payload);
  }

  /**
   * Helper to mark a notification as completed
   */
  async complete(id) {
    return this.update(id, { status: 'completed' });
  }

  /**
   * Helper to snooze a notification
   */
  async snooze(id) {
    return this.update(id, { status: 'snoozed' });
  }
}

export const Notification = new NotificationEntity();