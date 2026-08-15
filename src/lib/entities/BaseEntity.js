// src/lib/entities/BaseEntity.js
import { supabase } from '../supabaseClient';

export class BaseEntity {
  constructor(tableName, options = {}) {
    this.tableName = tableName;
    this.attachUserId = options.attachUserId ?? false; // default false unless specified
  }

  async list(options = {}) {
    let query = supabase.from(this.tableName).select('*');

    if (options.filter && typeof options.filter === 'object') {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    if (options.orderBy) {
      const [col, dir] = options.orderBy.split(':');
      query = query.order(col, { ascending: dir?.toLowerCase() !== 'desc' });
    }

    if (options.limit) query = query.limit(options.limit);

    const { data, error } = await query;
    if (error) throw new Error(`[${this.tableName}.list] ${error.message}`);
    return data || [];
  }

  async get(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(`[${this.tableName}.get] ${error.message}`);
    return data;
  }

  async create(record) {
    let payload = { ...record };

    if (this.attachUserId) {
      const { data: auth } = await supabase.auth.getUser();
      if (auth?.user?.id && !payload.created_by_id) {
        payload.created_by_id = auth.user.id;
      }
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`[${this.tableName}.create] ${error.message}`);
    return data;
  }

  async update(id, updates) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`[${this.tableName}.update] ${error.message}`);
    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw new Error(`[${this.tableName}.delete] ${error.message}`);
    return true;
  }
}