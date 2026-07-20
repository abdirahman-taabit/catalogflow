import { render, screen } from "@testing-library/react";

import { ProductComparison } from "@/features/enrichment/product-comparison";
import type { ProductDetail, Suggestion } from "@/lib/types";

const product: ProductDetail = {
  id: "product-1",
  sku: "KEY-1042",
  title: "WIRELESS KEYBOARD",
  description: "Short",
  category: "",
  keywords: "keyboard",
  qualityScore: 42,
  status: "NEEDS_REVIEW",
  problems: ["Title formatting", "Description too short"],
  suggestion: null,
  createdAt: "2026-07-20T10:00:00Z",
  updatedAt: "2026-07-20T10:00:00Z",
};

const suggestion: Suggestion = {
  id: "suggestion-1",
  productId: product.id,
  suggestedTitle: "Wireless Keyboard",
  suggestedDescription: "A reliable wireless keyboard designed for focused work and comfortable daily use.",
  suggestedCategory: "Computer accessories",
  suggestedKeywords: "wireless,keyboard,computer",
  confidenceScore: 90,
  explanation: "Rules applied: normalized title casing and matched the product category.",
  status: "PENDING",
  createdAt: "2026-07-20T10:00:00Z",
  reviewedAt: null,
};

describe("ProductComparison", () => {
  it("shows original and suggested values with the rule explanation", () => {
    render(<ProductComparison product={product} suggestion={suggestion} />);

    expect(screen.getByText("WIRELESS KEYBOARD")).toBeInTheDocument();
    expect(screen.getByText("Wireless Keyboard")).toBeInTheDocument();
    expect(screen.getByText("Computer accessories")).toBeInTheDocument();
    expect(screen.getByText(/normalized title casing/)).toBeInTheDocument();
    expect(screen.getByText("Not provided")).toBeInTheDocument();
  });
});
