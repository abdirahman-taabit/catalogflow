import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { ErrorState, LoadingState } from "@/components/data-state";

describe("data states", () => {
  it("announces loading content", () => {
    render(<LoadingState />);
    expect(screen.getByLabelText("Loading content")).toBeInTheDocument();
  });

  it("renders an actionable backend error", () => {
    const retry = vi.fn();
    render(<ErrorState description="The API is unavailable." onRetry={retry} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Backend unavailable");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
