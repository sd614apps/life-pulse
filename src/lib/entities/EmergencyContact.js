import { BaseEntity } from './BaseEntity';

class EmergencyContactEntity extends BaseEntity {
  constructor() {
    super('emergency_contacts', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      kind: 'family',
      ...record,
    };

    const required = ['label', 'phone', 'kind'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[EmergencyContact.create] Field "${field}" is required.`);
      }
    }

    const validKinds = ['services', 'doctor', 'family', 'ice'];
    if (!validKinds.includes(payload.kind)) {
      throw new Error(
        `[EmergencyContact.create] Invalid kind "${payload.kind}". Allowed: ${validKinds.join(', ')}`
      );
    }

    return super.create(payload);
  }
}

export const EmergencyContact = new EmergencyContactEntity();