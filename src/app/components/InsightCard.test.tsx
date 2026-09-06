import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EquationBlock, EquationLine, MathFraction, MathVariable } from "./InsightCard";

describe("EquationBlock math formatting", () => {
  it("renders semantic subscripts, superscripts, and stacked fractions", () => {
    const markup = renderToStaticMarkup(
      <EquationBlock
        label="Mass transfer"
        formula={
          <EquationLine>
            <MathFraction
              numerator={<MathVariable subscript="v" accent="dot">m</MathVariable>}
              denominator={<MathVariable subscript="d">m</MathVariable>}
            />
            = <MathVariable subscript="d" superscript="2">S</MathVariable>
          </EquationLine>
        }
        legend={[{ symbol: <MathVariable superscript="″">m</MathVariable>, meaning: "Mass flux" }]}
      />,
    );

    expect(markup).toContain("<sub");
    expect(markup).toContain("<sup");
    expect(markup).toContain("border-b");
    expect(markup).toContain('aria-label="time derivative"');
    expect(markup).toContain("Mass flux");
  });

  it("continues to accept plain-text formulas and legends", () => {
    const markup = renderToStaticMarkup(
      <EquationBlock label="Simple" formula="x = 1" legend={[{ symbol: "x", meaning: "A value" }]} />,
    );

    expect(markup).toContain("x = 1");
    expect(markup).toContain("A value");
  });
});
