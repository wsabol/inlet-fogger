import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Assumptions } from "./Assumptions";

describe("Assumptions constants", () => {
  it("formats constant decorations semantically", () => {
    const markup = renderToStaticMarkup(<Assumptions />);

    expect(markup).toContain("<sub");
    expect(markup).toContain("<sup");
    expect(markup).toContain('aria-label="time derivative"');
    expect(markup).toContain("air,ref");
    expect(markup).toContain("3.9 × 10");
  });
});
