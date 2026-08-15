import { BaseEntity } from './BaseEntity';
import { supabase } from '../supabaseClient';

class FeatureToggleEntity extends BaseEntity {
  constructor() {
    super('feature_toggles', { attachUserId: false });
  }

  /**
   * Helper to quickly check if a feature key is enabled.
   * Defaults to false if not found.
   */
  async isEnabled(featureKey) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('is_enabled')
      .eq('feature_key', featureKey)
      .maybeSingle();

    if (error) {
      console.error(`[FeatureToggle.isEnabled] Error checking ${featureKey}:`, error);
      return false;
    }
    return data?.is_enabled ?? false;
  }

  async create(record) {
    const payload = {
      is_enabled: true,
      ...record,
    };

    const required = ['feature_key', 'display_name', 'is_enabled'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[FeatureToggle.create] Field "${field}" is required.`);
      }
    }

    if (typeof payload.is_enabled !== 'boolean') {
      throw new Error('[FeatureToggle.create] "is_enabled" must be a boolean.');
    }

    return super.create(payload);
  }
}

export const FeatureToggle = new FeatureToggleEntity();