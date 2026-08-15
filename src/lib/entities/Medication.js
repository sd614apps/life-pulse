import { BaseEntity } from './BaseEntity';

class MedicationEntity extends BaseEntity {
  constructor() {
    super('medications', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      timing: 'morning',
      taken: false,
      ...record,
    };

    const required = ['member_name', 'medication_name', 'dose', 'timing'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[Medication.create] Field "${field}" is required.`);
      }
    }

    const validTimings = ['morning', 'noon', 'night'];
    if (!validTimings.includes(payload.timing)) {
      throw new Error(
        `[Medication.create] Invalid timing "${payload.timing}". Allowed: ${validTimings.join(', ')}`
      );
    }

    if (typeof payload.taken !== 'boolean') {
      payload.taken = Boolean(payload.taken);
    }

    return super.create(payload);
  }

  /**
   * Helper to toggle medication taken state
   */
  async setTakenStatus(id, taken) {
    return this.update(id, { taken: Boolean(taken) });
  }
}

export const Medication = new MedicationEntity();