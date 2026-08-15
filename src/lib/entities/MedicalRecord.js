import { BaseEntity } from './BaseEntity';

class MedicalRecordEntity extends BaseEntity {
  constructor() {
    super('medical_records', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      record_type: 'lab_report',
      date: new Date().toISOString().split('T')[0],
      ...record,
    };

    const required = ['member_name', 'record_type', 'title', 'date'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[MedicalRecord.create] Field "${field}" is required.`);
      }
    }

    const validRecordTypes = [
      'lab_report',
      'imaging',
      'prescription',
      'immunization',
      'allergy',
      'condition',
    ];
    if (!validRecordTypes.includes(payload.record_type)) {
      throw new Error(
        `[MedicalRecord.create] Invalid record_type "${payload.record_type}". Allowed: ${validRecordTypes.join(', ')}`
      );
    }

    return super.create(payload);
  }
}

export const MedicalRecord = new MedicalRecordEntity();