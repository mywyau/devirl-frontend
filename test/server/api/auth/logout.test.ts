import { describe, it, expect, vi, beforeEach } from 'vitest';
import logoutHandler from '@/server/api/auth/logout';
import { createEvent } from 'h3';

// Mocks
vi.mock('iron-session', () => ({
  getIronSession: vi.fn(),
}));

vi.mock('ofetch', () => ({
  $fetch: vi.fn(),
}));

vi.mock('h3', async () => {
  const h3 = await vi.importActual<typeof import('h3')>('h3');
  return {
    ...h3,
    sendRedirect: vi.fn(),
    setCookie: vi.fn(),
  };
});

vi.mock('@/configuration/ConfigLoader', () => ({
  loadConfig: () => ({
    devQuestBackend: {
      baseUrl: 'https://mock-backend.com',
    },
  }),
}));

const { getIronSession } = await import('iron-session');
const { $fetch } = await import('ofetch');
const { sendRedirect, setCookie } = await import('h3');

describe('logoutHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockEvent = () =>
    createEvent({
      req: new Request('http://localhost/api/auth/logout'),
      res: new Response(),
      context: {},
    });

  it('destroys session and clears cookie when user is logged in', async () => {
    const event = createMockEvent();
    const mockSession = {
      user: { sub: 'user123' },
      destroy: vi.fn(),
    };

    getIronSession.mockResolvedValue(mockSession);
    $fetch.mockResolvedValue({ ok: true });

    await logoutHandler(event);

    expect(getIronSession).toHaveBeenCalled();
    expect($fetch).toHaveBeenCalledWith(
      'https://mock-backend.com/auth/session/delete/user123',
      { method: 'DELETE' }
    );
    expect(mockSession.destroy).toHaveBeenCalled();
    expect(setCookie).toHaveBeenCalledWith(
      event,
      'user_type',
      '',
      expect.objectContaining({
        path: '/',
        httpOnly: false,
        maxAge: 0,
      })
    );
    expect(sendRedirect).toHaveBeenCalledWith(event, '/');
  });

  it('skips Redis delete when user not in session', async () => {
    const event = createMockEvent();
    const mockSession = {
      user: undefined,
      destroy: vi.fn(),
    };

    getIronSession.mockResolvedValue(mockSession);

    await logoutHandler(event);

    expect($fetch).not.toHaveBeenCalled();
    expect(mockSession.destroy).toHaveBeenCalled();
    expect(setCookie).toHaveBeenCalled();
    expect(sendRedirect).toHaveBeenCalledWith(event, '/');
  });

  it('logs and continues if Redis session delete fails', async () => {
    const event = createMockEvent();
    const mockSession = {
      user: { sub: 'user123' },
      destroy: vi.fn(),
    };

    getIronSession.mockResolvedValue(mockSession);
    $fetch.mockRejectedValue(new Error('Redis failure'));

    await logoutHandler(event);

    expect($fetch).toHaveBeenCalled();
    expect(mockSession.destroy).toHaveBeenCalled();
    expect(sendRedirect).toHaveBeenCalledWith(event, '/');
  });
});
