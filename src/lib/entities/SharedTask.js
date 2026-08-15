import { BaseEntity } from './BaseEntity';

class SharedTaskEntity extends BaseEntity {
  constructor() {
    super('shared_tasks', { attachUserId: true });
  }

  async create(record) {
    const payload = {
      status: 'active',
      priority: 'medium',
      ...record,
    };

    const required = ['title', 'assignee', 'status'];
    for (const field of required) {
      if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
        throw new Error(`[SharedTask.create] Field "${field}" is required.`);
      }
    }

    const validStatuses = ['active', 'completed'];
    if (!validStatuses.includes(payload.status)) {
      throw new Error(
        `[SharedTask.create] Invalid status "${payload.status}". Allowed: ${validStatuses.join(', ')}`
      );
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (payload.priority && !validPriorities.includes(payload.priority)) {
      throw new Error(
        `[SharedTask.create] Invalid priority "${payload.priority}". Allowed: ${validPriorities.join(', ')}`
      );
    }

    return super.create(payload);
  }

  /**
   * Helper to toggle task completion status
   */
  async toggleComplete(id, isCompleted) {
    return this.update(id, { status: isCompleted ? 'completed' : 'active' });
  }
}

export const SharedTask = new SharedTaskEntity();