import { BaseEntity } from './BaseEntity';

class SessionLogEntity extends BaseEntity {
  constructor() {
    super('session_logs', { attachUserId: false });
  }

  async create(record) {
    const payload = {
      status: 'active',
      last_active_at: new Date().toISOString(),
      ...record,
    };

    const required = ['device_type', 'location', 'last_active_at', 'status'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[SessionLog.create] Field "${field}" is required.`);
      }
    }

    const validStatuses = ['active', 'revoked'];
    if (!validStatuses.includes(payload.status)) {
      throw new Error(
        `[SessionLog.create] Invalid status "${payload.status}". Allowed: ${validStatuses.join(', ')}`
      );
    }

    return super.create(payload);
  }

  /**
   * Helper to revoke an active session
   */
  async revoke(id) {
    return this.update(id, { status: 'revoked' });
  }
}

export const SessionLog = new SessionLogEntity();