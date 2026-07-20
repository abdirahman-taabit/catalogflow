import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/lib/api", () => ({
  API_URL: "http://localhost:8080",
  ApiRequestError: class ApiRequestError extends Error {},
  uploadCatalog: vi.fn().mockResolvedValue({
    id: "import-1",
    filename: "catalog.csv",
    totalRows: 4,
    importedRows: 2,
    rejectedRows: 2,
    duplicateRows: 1,
    status: "COMPLETED_WITH_ERRORS",
    createdAt: "2026-07-20T10:00:00Z",
    rejections: [
      { rowNumber: 3, sku: "BAD SKU", reason: "Invalid SKU" },
      { rowNumber: 4, sku: "CAM-1", reason: "Duplicate SKU" },
    ],
  }),
}));

import { CatalogImportForm } from "@/features/imports/catalog-import-form";

describe("CatalogImportForm", () => {
  it("uploads a CSV and renders the validation summary", async () => {
    const user = userEvent.setup();
    render(<CatalogImportForm />);
    const file = new File(["sku,title,description,category\nCAM-1,Camera,Description,Photography"],
      "catalog.csv", { type: "text/csv" });

    await user.upload(screen.getByLabelText("Catalog CSV file"), file);
    await user.click(screen.getByRole("button", { name: "Validate and import" }));

    expect(await screen.findByText("catalog.csv processed")).toBeInTheDocument();
    expect(screen.getByText("2 rows need correction")).toBeInTheDocument();
    expect(screen.getByText("Duplicate SKUs")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Download rejection report/ })).toHaveAttribute(
      "href", "http://localhost:8080/api/imports/import-1/rejections.csv",
    );
  });

  it("rejects non-CSV files before upload", async () => {
    render(<CatalogImportForm />);

    fireEvent.change(screen.getByLabelText("Catalog CSV file"), {
      target: { files: [new File(["text"], "notes.txt", { type: "text/plain" })] },
    });

    expect(await screen.findByRole("alert")).toHaveTextContent("must be a CSV");
  });
});
