import { vi } from 'vitest';

export function createMockEntities(overrides = {}) {
  const defaultUser = {
    id: 'user-1',
    email: 'test@example.com',
    role: 'user',
    user_metadata: {},
    app_metadata: {},
  };

  const makeEntity = (methods = {}) => ({
    list: vi.fn().mockResolvedValue([]),
    filter: vi.fn().mockResolvedValue([]),
    get: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({ id: 'new-id' }),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    deleteMany: vi.fn().mockResolvedValue({}),
    bulkCreate: vi.fn().mockResolvedValue([]),
    subscribe: vi.fn().mockReturnValue(() => {}),
    ...methods,
  });

  const entities = new Proxy({}, {
    get(target, prop) {
      if (!(prop in target)) {
        target[prop] = makeEntity();
      }
      return target[prop];
    },
  });

  const mockSupabase = {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: defaultUser }, error: null }),
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: defaultUser, access_token: 'mock-token' } },
        error: null,
      }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: defaultUser }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      updateUser: vi.fn().mockResolvedValue({ data: { user: defaultUser }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      then: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  };

  return {
    entities,
    supabase: mockSupabase,
    ...overrides,
  };
}

export async function parseJsonResponse(response) {
  const body = await response.json();
  return { status: response.status, body };
}