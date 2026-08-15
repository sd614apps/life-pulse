import { BaseEntity } from './BaseEntity';
import { supabase } from '../supabaseClient';

class ProfileEntity extends BaseEntity {
  constructor() {
    super('profiles', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      role: 'primary',
      view_mode: 'standard',
      permission_level: 'contributor',
      family_role: 'family_member',
      ...record,
    };

    const required = ['display_name', 'role', 'view_mode'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[Profile.create] Field "${field}" is required.`);
      }
    }

    const validRoles = ['primary', 'elderly', 'teenager', 'dependent'];
    if (!validRoles.includes(payload.role)) {
      throw new Error(
        `[Profile.create] Invalid role "${payload.role}". Allowed: ${validRoles.join(', ')}`
      );
    }

    const validViewModes = ['standard', 'simplified', 'dependent'];
    if (!validViewModes.includes(payload.view_mode)) {
      throw new Error(
        `[Profile.create] Invalid view_mode "${payload.view_mode}". Allowed: ${validViewModes.join(', ')}`
      );
    }

    const validPermissions = ['admin', 'contributor', 'viewer'];
    if (payload.permission_level && !validPermissions.includes(payload.permission_level)) {
      throw new Error(
        `[Profile.create] Invalid permission_level "${payload.permission_level}". Allowed: ${validPermissions.join(', ')}`
      );
    }

    const validFamilyRoles = ['family_admin', 'family_member', 'family_dependent'];
    if (payload.family_role && !validFamilyRoles.includes(payload.family_role)) {
      throw new Error(
        `[Profile.create] Invalid family_role "${payload.family_role}". Allowed: ${validFamilyRoles.join(', ')}`
      );
    }

    if (payload.age !== undefined && payload.age !== null) {
      payload.age = Number(payload.age);
    }

    return super.create(payload);
  }

  /**
   * Helper to fetch profiles belonging to a specific family ID
   */
  async listByFamily(familyId) {
    return this.list({ filter: { family_id: familyId } });
  }
}

export const Profile = new ProfileEntity();