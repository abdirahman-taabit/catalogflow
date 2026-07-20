import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

const state = vi.hoisted(() => ({ keys: [] as string[] }));

vi.mock("next/navigation", () => ({ usePathname: () => "/products" }));
vi.mock("@/lib/api", () => ({ getProducts: vi.fn() }));
vi.mock("swr", () => ({
  default: (key: string) => {
    state.keys.push(key);
    return {
      data: {
        items: [{
          id: "product-1",
          sku: "KEY-1042",
          title: "Wireless Mechanical Keyboard",
          category: "Computer accessories",
          qualityScore: 72,
          status: "NEEDS_REVIEW",
          problems: ["Description too short"],
          updatedAt: "2026-07-20T10:00:00Z",
        }],
        page: 0,
        size: 10,
        totalItems: 1,
        totalPages: 1,
      },
      isLoading: false,
      error: null,
      mutate: vi.fn(),
    };
  },
}));

import ProductsPage from "@/app/products/page";

describe("product search and filters", () => {
  it("includes search and status values in the backend query", async () => {
    const user = userEvent.setup();
    render(<ProductsPage />);

    await user.type(screen.getByLabelText("Search products"), "keyboard");
    await waitFor(() => {
      expect(state.keys.some((key) => key.includes("search=keyboard"))).toBe(true);
    });

    await user.click(screen.getByRole("combobox", { name: "Filter by status" }));
    await user.click(screen.getByRole("option", { name: "Needs review" }));
    await waitFor(() => {
      expect(state.keys.some((key) => key.includes("status=NEEDS_REVIEW"))).toBe(true);
    });
  });
});
