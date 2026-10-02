type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiRequest<T>(
  url: string,
  { body, headers, ...options }: ApiOptions = {}
): Promise<T> {
  const hasJsonBody = body !== undefined;
  const response = await fetch(url, {
    cache: options.method === "GET" || !options.method ? "no-store" : undefined,
    ...options,
    headers: {
      ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: hasJsonBody ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "ดำเนินการไม่สำเร็จ");
  }

  return data as T;
}

export function apiGet<T>(url: string) {
  return apiRequest<T>(url, { method: "GET" });
}

export function apiPost<T>(url: string, body: unknown) {
  return apiRequest<T>(url, { method: "POST", body });
}

export function apiPatch<T>(url: string, body: unknown) {
  return apiRequest<T>(url, { method: "PATCH", body });
}

export function apiDelete<T>(url: string) {
  return apiRequest<T>(url, { method: "DELETE" });
}
