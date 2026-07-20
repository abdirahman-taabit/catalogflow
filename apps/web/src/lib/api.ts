import type {
  ApiErrorBody,
  AuditEvent,
  DashboardData,
  ImportJob,
  PageResponse,
  ProductDetail,
  ProductSummary,
  Suggestion,
} from "@/lib/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8080";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code = "REQUEST_FAILED",
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiRequestError(
      body?.message ?? "CatalogFlow could not complete the request.",
      response.status,
      body?.code,
    );
  }
  return response.json() as Promise<T>;
}

export function getDashboard() {
  return request<DashboardData>("/api/dashboard");
}

export function getProducts(query = "") {
  return request<PageResponse<ProductSummary>>(`/api/products${query}`);
}

export function getProduct(id: string) {
  return request<ProductDetail>(`/api/products/${id}`);
}

export function getProductAudit(id: string) {
  return request<AuditEvent[]>(`/api/products/${id}/audit-events`);
}

export function generateSuggestion(id: string) {
  return request<Suggestion>(`/api/products/${id}/suggestions`, { method: "POST" });
}

export function approveSuggestion(id: string) {
  return request<ProductDetail>(`/api/suggestions/${id}/approve`, { method: "POST" });
}

export function rejectSuggestion(id: string) {
  return request<ProductDetail>(`/api/suggestions/${id}/reject`, { method: "POST" });
}

export function uploadCatalog(file: File) {
  const form = new FormData();
  form.append("file", file);
  return request<ImportJob>("/api/imports", { method: "POST", body: form });
}

export function getActivity(page = 0) {
  return request<PageResponse<AuditEvent>>(`/api/activity?page=${page}&size=20`);
}

