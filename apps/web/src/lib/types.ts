export type EnrichmentStatus =
  | "NEEDS_REVIEW"
  | "SUGGESTION_PENDING"
  | "ENRICHED"
  | "REJECTED"
  | "COMPLETE";

export type SuggestionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Suggestion {
  id: string;
  productId: string;
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedCategory: string;
  suggestedKeywords: string;
  confidenceScore: number;
  explanation: string;
  status: SuggestionStatus;
  createdAt: string;
  reviewedAt: string | null;
}

export interface ProductSummary {
  id: string;
  sku: string;
  title: string;
  category: string;
  qualityScore: number;
  status: EnrichmentStatus;
  problems: string[];
  updatedAt: string;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  keywords: string;
  suggestion: Suggestion | null;
  createdAt: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface ImportRejection {
  rowNumber: number;
  sku: string;
  reason: string;
}

export interface ImportJob {
  id: string;
  filename: string;
  totalRows: number;
  importedRows: number;
  rejectedRows: number;
  duplicateRows: number;
  status: "PROCESSING" | "COMPLETED" | "COMPLETED_WITH_ERRORS" | "FAILED";
  createdAt: string;
  rejections: ImportRejection[];
}

export interface AuditEvent {
  id: string;
  productId: string | null;
  eventType:
    | "PRODUCT_IMPORTED"
    | "SUGGESTION_CREATED"
    | "SUGGESTION_APPROVED"
    | "SUGGESTION_REJECTED"
    | "IMPORT_COMPLETED";
  previousValues: string | null;
  newValues: string | null;
  createdAt: string;
}

export interface DashboardData {
  totalProducts: number;
  productsRequiringReview: number;
  pendingSuggestions: number;
  approvedImprovements: number;
  averageQuality: number;
  qualityOverview: { healthy: number; watch: number; critical: number };
  recentImports: ImportJob[];
  recentActivity: AuditEvent[];
}

export interface ApiErrorBody {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
}

