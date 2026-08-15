import { BaseEntity } from './BaseEntity';
import { supabase } from '../supabaseClient';

class AppConfigurationEntity extends BaseEntity {
  constructor() {
    super('app_configurations', { attachUserId: false });
  }

  /**
   * Fetch a specific configuration item by key name
   */
  async getByKey(configKey) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('config_key', configKey)
      .maybeSingle();

    if (error) throw new Error(`[AppConfiguration.getByKey] ${error.message}`);
    return data;
  }

  async create(record) {
    const payload = {
      category: 'general',
      is_default: true,
      ...record,
    };

    const required = ['config_key', 'config_value', 'category'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[AppConfiguration.create] Field "${field}" is required.`);
      }
    }

    const validCategories = ['security', 'accessibility', 'privacy', 'general'];
    if (!validCategories.includes(payload.category)) {
      throw new Error(`[AppConfiguration.create] Invalid category "${payload.category}". Allowed: ${validCategories.join(', ')}`);
    }

    return super.create(payload);
  }
}

export const AppConfiguration = new AppConfigurationEntity();