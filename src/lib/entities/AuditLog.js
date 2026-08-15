import { BaseEntity } from './BaseEntity';

class AuditLogEntity extends BaseEntity {
  constructor() {
    super('audit_logs', { attachUserId: false });
  }

  async create(record) {
    const payload = {
      event_type: 'access',
      severity: 'info',
      ...record,
    };

    const required = ['event_type', 'message'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[AuditLog.create] Field "${field}" is required.`);
      }
    }

    const validEventTypes = [
      'decryption',
      'login',
      'mfa',
      'reset',
      'toggle',
      'access',
      'password_change',
    ];
    if (!validEventTypes.includes(payload.event_type)) {
      throw new Error(
        `[AuditLog.create] Invalid event_type "${payload.event_type}". Allowed: ${validEventTypes.join(', ')}`
      );
    }

    const validSeverities = ['info', 'warning', 'critical'];
    if (!validSeverities.includes(payload.severity)) {
      throw new Error(
        `[AuditLog.create] Invalid severity "${payload.severity}". Allowed: ${validSeverities.join(', ')}`
      );
    }

    return super.create(payload);
  }
}

export const AuditLog = new AuditLogEntity();