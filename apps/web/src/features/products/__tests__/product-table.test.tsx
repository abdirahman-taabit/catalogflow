import { render, screen } from "@testing-library/react";

import { ProductTable } from "@/features/products/product-table";
import type { ProductSummary } from "@/lib/types";

const products: ProductSummary[] = [{
  id: "product-1",
  sku: "CAM-8820",
  title: "Compact Travel Camera",
  category: "",
  qualityScore: 55,
  status: "NEEDS_REVIEW",
  problems: ["Category missing", "Description too short"],
  updatedAt: "2026-07-20T10:00:00Z",
}];

describe("ProductTable", () => {
  it("renders product quality and review information", () => {
    render(<ProductTable products={products} hasSearch={false} />);

    expect(screen.getAllByText("Compact Travel Camera")).toHaveLength(2);
    expect(screen.getAllByText("CAM-8820")).toHaveLength(2);
    expect(screen.getByText("2 open")).toBeInTheDocument();
    expect(screen.getByText("Missing")).toBeInTheDocument();
  });

  it("shows a search-specific empty state", () => {
    render(<ProductTable products={[]} hasSearch />);

    expect(screen.getByText("No matching products")).toBeInTheDocument();
    expect(screen.getByText(/different search/)).toBeInTheDocument();
  });
});
