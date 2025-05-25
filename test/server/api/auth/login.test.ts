import { describe, it, expect, vi, beforeEach } from 'vitest';
import loginHandler from '@/server/api/auth/login';
import { createEvent } from 'h3';

// Mock sendRedirect from h3
vi.mock('h3', async () => {
  const actual = await vi.importActual<typeof import('h3')>('h3');
  return {
    ...actual,
    sendRedirect: vi.fn(),
  };
});

const { sendRedirect } = await import('h3');

describe('loginHandler', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...OLD_ENV }; // Reset env vars for each test
    process.env.NUXT_PUBLIC_AUTH0_DOMAIN = 'example.auth0.com';
    process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID = 'abc123';
    process.env.NUXT_PUBLIC_AUTH0_CALLBACK_URL = 'http://localhost:3000/api/auth/callback';
  });

  it('builds correct redirect URL and calls sendRedirect', async () => {
    const event = createEvent({ req: new Request('http://localhost'), res: new Response() });

    await loginHandler(event);

    const expectedParams = new URLSearchParams({
      response_type: 'code',
      client_id: 'abc123',
      redirect_uri: 'http://localhost:3000/api/auth/callback',
      scope: 'openid profile email'
    }).toString();

    const expectedUrl = `https://example.auth0.com/authorize?${expectedParams}`;

    expect(sendRedirect).toHaveBeenCalledWith(event, expectedUrl);
  });

  it('throws if required env vars are missing', async () => {
    process.env.NUXT_PUBLIC_AUTH0_CLIENT_ID = undefined as any;

    const event = createEvent({ req: new Request('http://localhost'), res: new Response() });

    await expect(loginHandler(event)).rejects.toThrow();
  });
});
