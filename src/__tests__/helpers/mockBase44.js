import { vi } from 'vitest';

export function createMockBase44(overrides = {}) {
  const defaultUser = { id: 'user-1', email: 'test@example.com', role: 'user', data: {} };
  const entities = {};

  const makeEntity = (name, methods = {}) => ({
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

  const client = {
    auth: {
      me: vi.fn().mockResolvedValue(defaultUser),
      loginViaEmailPassword: vi.fn(),
      logout: vi.fn(),
      updateMe: vi.fn(),
    },
    entities: new Proxy(entities, {
      get(target, prop) {
        if (!(prop in target)) target[prop] = makeEntity(prop);
        return target[prop];
      },
    }),
    asServiceRole: {
      entities: new Proxy({}, {
        get(_, prop) {
          return makeEntity(prop);
        },
      }),
      integrations: {
        Core: {
          InvokeLLM: vi.fn().mockResolvedValue('Here you go.'),
        },
      },
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({}),
    },
    ...overrides,
  };

  return client;
}

export async function parseJsonResponse(response) {
  const body = await response.json();
  return { status: response.status, body };
}
