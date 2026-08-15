import { BaseEntity } from './BaseEntity';
import { supabase } from '../supabaseClient';

class UserEntity extends BaseEntity {
  constructor() {
    super('users', { attachUserId: false });
  }

  /**
   * Helper to fetch current logged-in user's app-level data
   */
  async getCurrentUser() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user?.id) return null;
    return this.get(auth.user.id);
  }

  async create(record) {
    const payload = {
      system_role: 'app_user',
      family_role: 'family_member',
      ...record,
    };

    const required = ['role'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[User.create] Field "${field}" is required.`);
      }
    }

    const validRoles = ['admin', 'user'];
    if (!validRoles.includes(payload.role)) {
      throw new Error(`[User.create] Invalid role "${payload.role}". Allowed: ${validRoles.join(', ')}`);
    }

    const validSystemRoles = ['app_admin', 'app_user'];
    if (payload.system_role && !validSystemRoles.includes(payload.system_role)) {
      throw new Error(`[User.create] Invalid system_role "${payload.system_role}". Allowed: ${validSystemRoles.join(', ')}`);
    }

    const validFamilyRoles = ['family_admin', 'family_member', 'family_dependent'];
    if (payload.family_role && !validFamilyRoles.includes(payload.family_role)) {
      throw new Error(`[User.create] Invalid family_role "${payload.family_role}". Allowed: ${validFamilyRoles.join(', ')}`);
    }

    return super.create(payload);
  }
}

export const User = new UserEntity();