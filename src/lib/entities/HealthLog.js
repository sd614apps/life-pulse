import { BaseEntity } from './BaseEntity';

class HealthLogEntity extends BaseEntity {
  constructor() {
    super('health_logs', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      metric_type: 'heart_rate',
      secondary_value: 0,
      status: 'logged',
      ...record,
    };

    const required = ['member_name', 'metric_type', 'value', 'logged_at', 'status'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[HealthLog.create] Field "${field}" is required.`);
      }
    }

    const validMetrics = ['blood_pressure', 'heart_rate', 'steps', 'blood_sugar'];
    if (!validMetrics.includes(payload.metric_type)) {
      throw new Error(
        `[HealthLog.create] Invalid metric_type "${payload.metric_type}". Allowed: ${validMetrics.join(', ')}`
      );
    }

    const validStatuses = ['logged', 'upcoming'];
    if (!validStatuses.includes(payload.status)) {
      throw new Error(
        `[HealthLog.create] Invalid status "${payload.status}". Allowed: ${validStatuses.join(', ')}`
      );
    }

    if (typeof payload.value !== 'number') {
      payload.value = Number(payload.value);
    }

    if (typeof payload.secondary_value !== 'number') {
      payload.secondary_value = Number(payload.secondary_value) || 0;
    }

    return super.create(payload);
  }
}

export const HealthLog = new HealthLogEntity();