import { BaseEntity } from './BaseEntity';

class AppointmentEntity extends BaseEntity {
  constructor() {
    super('appointments', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      status: 'upcoming',
      reminder_sent: false,
      ...record,
    };

    const required = ['member_name', 'doctor_name', 'appointment_at', 'status'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[Appointment.create] Field "${field}" is required.`);
      }
    }

    const validStatuses = ['upcoming', 'past'];
    if (!validStatuses.includes(payload.status)) {
      throw new Error(`[Appointment.create] Invalid status "${payload.status}". Allowed: ${validStatuses.join(', ')}`);
    }

    return super.create(payload);
  }
}

export const Appointment = new AppointmentEntity();