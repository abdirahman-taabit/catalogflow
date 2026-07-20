import "@testing-library/jest-dom/vitest";

Object.defineProperty(Element.prototype, "hasPointerCapture", {
  configurable: true,
  value: () => false,
});
Object.defineProperty(Element.prototype, "setPointerCapture", {
  configurable: true,
  value: () => undefined,
});
Object.defineProperty(Element.prototype, "releasePointerCapture", {
  configurable: true,
  value: () => undefined,
});
Object.defineProperty(Element.prototype, "scrollIntoView", {
  configurable: true,
  value: () => undefined,
});
