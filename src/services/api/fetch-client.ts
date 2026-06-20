const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

let tokenGetter: () => string | null = () => null;

export function setApiTokenGetter(getter: () => string | null) {
  tokenGetter = getter;
}

export function isApiEnabled() {
  return Boolean(API_URL);
}

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL not configured");
  }

  const token = tokenGetter();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { code?: string; message?: string };
    throw new ApiError(body.code ?? "API_ERROR", body.message ?? response.statusText);
  }

  return response.json() as Promise<T>;
}
