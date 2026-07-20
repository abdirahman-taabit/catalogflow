import { readFile } from "node:fs/promises";
import path from "node:path";

import { expect, test } from "@playwright/test";

test("complete catalog import and approval journey", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "The full mutation journey runs once in desktop Chrome.");
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Turn messy product data/ })).toBeVisible();
  await page.getByRole("link", { name: "Open Demo" }).first().click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Keep your catalog accurate, consistent, and ready to sell." })).toBeVisible();

  await page.getByRole("link", { name: "Imports" }).click();
  const sample = await readFile(path.resolve(process.cwd(), "../../sample-data/catalogflow-sample.csv"), "utf8");
  const journeySku = `E2E-${Date.now()}`;
  const journeyCsv = `${sample.trimEnd()}\n${journeySku},WIRELESS E2E KEYBOARD,Basic keyboard.,\n`;
  await page.getByLabel("Catalog CSV file").setInputFiles({
    name: "catalogflow-sample.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(journeyCsv),
  });
  await page.getByRole("button", { name: "Validate and import" }).click();
  await expect(page.getByText(/catalogflow-sample\.csv processed/)).toBeVisible();
  await expect(page.getByText("Duplicate SKUs", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Download rejection report/ })).toBeVisible();

  await page.getByRole("link", { name: "Products" }).click();
  await page.getByLabel("Search products").fill(journeySku);
  await expect(page.getByText(journeySku).first()).toBeVisible();
  await page.getByRole("link", { name: "WIRELESS E2E KEYBOARD", exact: true }).first().click();
  await page.getByRole("button", { name: "Generate suggestion" }).click();
  await expect(page.getByText(/% confidence/)).toBeVisible();
  await expect(page.getByText("Wireless E2e Keyboard", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Approve and update product" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "Approve changes" }).click();
  await expect(page.getByText("Enriched", { exact: true })).toBeVisible();
  await expect(page.getByText("Suggestion Approved", { exact: true })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test("mobile navigation uses a compact card layout", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The responsive check runs in mobile Chrome.");
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/products");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await expect(page.getByRole("table")).toBeHidden();
  await expect(page.getByRole("link", { name: /Camera|Keyboard|Mouse/i }).first()).toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
  expect(consoleErrors).toEqual([]);
});
