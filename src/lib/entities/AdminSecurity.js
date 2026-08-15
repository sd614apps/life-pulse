import { BaseEntity } from './BaseEntity';

class AdminSecurityEntity extends BaseEntity {
  constructor() {
    super('admin_security', { attachUserId: false });
  }

  async create(record) {
    const payload = {
      must_change_password: true,
      mfa_enforced: false,
      ...record,
    };

    if (typeof payload.must_change_password !== 'boolean' || typeof payload.mfa_enforced !== 'boolean') {
      throw new Error('[AdminSecurity.create] must_change_password and mfa_enforced are required booleans.');
    }

    return super.create(payload);
  }
}

export const AdminSecurity = new AdminSecurityEntity();