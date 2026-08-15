import { BaseEntity } from './BaseEntity';

class TravelDocumentEntity extends BaseEntity {
  constructor() {
    super('travel_documents', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      doc_type: 'passport',
      ...record,
    };

    const required = ['member_name', 'doc_type', 'expiry_date'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[TravelDocument.create] Field "${field}" is required.`);
      }
    }

    const validDocTypes = ['passport', 'visa', 'drivers_license', 'other'];
    if (!validDocTypes.includes(payload.doc_type)) {
      throw new Error(
        `[TravelDocument.create] Invalid doc_type "${payload.doc_type}". Allowed: ${validDocTypes.join(', ')}`
      );
    }

    return super.create(payload);
  }
}

export const TravelDocument = new TravelDocumentEntity();