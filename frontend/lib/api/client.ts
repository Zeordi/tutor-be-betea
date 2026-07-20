const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? (options.body ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  const payload = (await res.json().catch(() => ({}))) as ApiEnvelope<T> & T & {
    message?: string;
    error?: string;
  };

  if (!res.ok) {
    const rawMessage = payload?.message ?? payload?.error;
    let message = `Request failed: ${res.status}`;
    if (typeof rawMessage === 'string' && rawMessage.trim()) {
      message = rawMessage;
    } else if (Array.isArray(rawMessage)) {
      message = rawMessage.map(String).join(', ');
    } else if (rawMessage && typeof rawMessage === 'object') {
      const nested = rawMessage as { message?: string | string[] };
      if (typeof nested.message === 'string') message = nested.message;
      else if (Array.isArray(nested.message)) message = nested.message.map(String).join(', ');
    } else if (
      typeof payload === 'object' &&
      payload &&
      'data' in payload &&
      (payload as { data?: { message?: string } }).data?.message
    ) {
      message = String((payload as { data?: { message?: string } }).data?.message);
    }
    throw new Error(message);
  }

  if (payload && typeof payload === 'object' && 'data' in payload && payload.data !== undefined) {
    return payload.data as T;
  }

  return payload as T;
}

export const apiClient = {
  get: <T>(path: string, token?: string) => request<T>(path, { token }),
  post: <T>(path: string, body: unknown, token?: string) => request<T>(path, { body, token }),
  patch: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: 'PATCH', body, token }),
  put: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: 'PUT', body, token }),
  delete: <T>(path: string, token?: string) => request<T>(path, { method: 'DELETE', token }),
};
