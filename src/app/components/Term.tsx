import { Link } from "react-router-dom";
import { GLOSSARY, type GlossaryId } from "../content/glossary";

export function Term({ id, children }: { id: GlossaryId; children?: React.ReactNode }) {
  const entry = GLOSSARY[id];
  return (
    <Link
      to={entry.href}
      title={entry.meaning}
      className="text-cream underline decoration-gold/40 underline-offset-2 hover:decoration-gold"
    >
      {children ?? entry.term}
    </Link>
  );
}
