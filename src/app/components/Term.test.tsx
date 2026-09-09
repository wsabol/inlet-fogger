import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Term } from "./Term";

function renderTerm(term: React.ReactNode) {
  return renderToStaticMarkup(<MemoryRouter>{term}</MemoryRouter>);
}

describe("Term", () => {
  it("renders a glossary term with a lowercase initial", () => {
    expect(renderTerm(<Term id="ideal-gas" case="lower" />)).toContain(">ideal gas</a>");
  });

  it("renders a glossary term with a title-case initial", () => {
    expect(renderTerm(<Term id="ideal-gas" case="title" />)).toContain(">Ideal gas</a>");
  });

  it("preserves the supplied case by default", () => {
    expect(renderTerm(<Term id="ideal-gas">IDEAL gas</Term>)).toContain(">IDEAL gas</a>");
  });

  it("uses an accessible custom tooltip instead of a native title", () => {
    const markup = renderTerm(<Term id="ideal-gas" />);

    expect(markup).toContain("aria-describedby=");
    expect(markup).not.toContain("title=");
  });
});
