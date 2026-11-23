import { describe, expect, it, vi, afterEach } from 'vitest';
import { GET } from '../app/api/github-stars/route';

describe('/api/github-stars route handler', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns stargazers_count when GitHub API responds with 200', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stargazers_count: 42 }),
    } as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ count: 42 });
  });

  it('returns null count when GitHub API returns error status', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
    } as any);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ count: null });
  });

  it('returns null count on network exception', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ count: null });
  });
});
