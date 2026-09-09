import { Link } from "react-router-dom";
import { GLOSSARY, type GlossaryId } from "../content/glossary";
import { Tooltip } from "./Tooltip";

type TermProps = {
  id: GlossaryId;
  children?: React.ReactNode;
  case?: "lower" | "title";
};

function applyCase(value: string, textCase?: TermProps["case"]) {
  if (!textCase || value.length === 0) return value;

  const firstCharacter = textCase === "lower"
    ? value[0].toLocaleLowerCase()
    : value[0].toLocaleUpperCase();

  return `${firstCharacter}${value.slice(1)}`;
}

export function Term({ id, children, case: textCase }: TermProps) {
  const entry = GLOSSARY[id];
  const content = children ?? entry.term;
  const displayContent = typeof content === "string" ? applyCase(content, textCase) : content;

  return (
    <Tooltip content={entry.meaning}>
      {(tooltipProps) => (
        <Link
          {...tooltipProps}
          to={entry.href}
          className="text-cream underline decoration-gold/40 underline-offset-2 hover:decoration-gold focus-visible:decoration-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/70"
        >
          {displayContent}
        </Link>
      )}
    </Tooltip>
  );
}
