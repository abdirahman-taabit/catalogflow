import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const state = vi.hoisted(() => ({
  approve: vi.fn().mockResolvedValue({}),
  reject: vi.fn().mockResolvedValue({}),
  mutateProduct: vi.fn().mockResolvedValue(undefined),
  mutateAudit: vi.fn().mockResolvedValue(undefined),
  product: {
    id: "product-1",
    sku: "CAM-8820",
    title: "COMPACT TRAVEL CAMERA",
    description: "Short description",
    category: "Photography",
    keywords: "camera",
    qualityScore: 55,
    status: "SUGGESTION_PENDING",
    problems: ["Title formatting", "Description too short"],
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-20T10:00:00Z",
    suggestion: {
      id: "suggestion-1",
      productId: "product-1",
      suggestedTitle: "Compact Travel Camera",
      suggestedDescription: "A compact travel camera designed for reliable everyday photography and easy transport.",
      suggestedCategory: "Photography",
      suggestedKeywords: "compact,travel,camera,photography",
      confidenceScore: 85,
      explanation: "Rules applied: normalized title casing and expanded a short description.",
      status: "PENDING",
      createdAt: "2026-07-20T10:00:00Z",
      reviewedAt: null,
    },
  },
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "product-1" }),
  usePathname: () => "/products/product-1",
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("swr", () => ({
  default: (key: string) => key.startsWith("product-audit:")
    ? { data: [], isLoading: false, error: null, mutate: state.mutateAudit }
    : { data: state.product, isLoading: false, error: null, mutate: state.mutateProduct },
}));
vi.mock("@/lib/api", () => ({
  ApiRequestError: class ApiRequestError extends Error {},
  approveSuggestion: state.approve,
  rejectSuggestion: state.reject,
  generateSuggestion: vi.fn(),
  getProduct: vi.fn(),
  getProductAudit: vi.fn(),
}));

import ProductDetailPage from "@/app/products/[id]/page";

describe("product review actions", () => {
  it("confirms and calls the approval flow", async () => {
    const user = userEvent.setup();
    render(<ProductDetailPage />);

    await user.click(screen.getByRole("button", { name: "Approve and update product" }));
    expect(screen.getByRole("alertdialog")).toHaveTextContent("Approve these product changes?");
    await user.click(screen.getByRole("button", { name: "Approve changes" }));

    expect(state.approve).toHaveBeenCalledWith("suggestion-1");
    expect(state.mutateProduct).toHaveBeenCalled();
    expect(state.mutateAudit).toHaveBeenCalled();
  });

  it("confirms and calls the rejection flow", async () => {
    const user = userEvent.setup();
    render(<ProductDetailPage />);

    await user.click(screen.getByRole("button", { name: "Reject suggestion" }));
    expect(screen.getByRole("alertdialog")).toHaveTextContent("Reject this suggestion?");
    await user.click(screen.getByRole("button", { name: "Reject suggestion" }));

    expect(state.reject).toHaveBeenCalledWith("suggestion-1");
  });
});
