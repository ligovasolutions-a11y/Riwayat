'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const CsrfContext = createContext<string>('');

export function CsrfProvider({ token, children }: { token: string; children: React.ReactNode }) {
  return <CsrfContext.Provider value={token}>{children}</CsrfContext.Provider>;
}

class AdminApiError extends Error {
  status: number;
  reasons?: string[];
  constructor(message: string, status: number, reasons?: string[]) {
    super(message);
    this.status = status;
    this.reasons = reasons;
  }
}

export function useAdminApi() {
  const csrfToken = useContext(CsrfContext);

  const call = useCallback(async (url: string, options: { method?: string; body?: unknown; isFormData?: boolean } = {}) => {
    const { method = 'GET', body, isFormData } = options;
    const headers: Record<string, string> = { 'X-CSRF-Token': csrfToken };
    let payload: BodyInit | undefined;

    if (isFormData) {
      payload = body as FormData;
    } else if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    const res = await fetch(url, { method, headers, body: payload });
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json().catch(() => ({})) : undefined;

    if (!res.ok) {
      throw new AdminApiError((data && data.error) || `Request failed (${res.status})`, res.status, data?.reasons);
    }
    return data;
  }, [csrfToken]);

  return { call, csrfToken };
}

export function useToast() {
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const show = useCallback((text: string, error = false) => {
    setMessage({ text, error });
    setTimeout(() => setMessage(null), 2600);
  }, []);

  return { message, show };
}
