import { Link } from "react-router-dom";
import { NAV } from "../nav";
import { BuyMeACoffeeButton } from "./BuyMeACoffeeButton";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mt-1 font-sans text-sm uppercase tracking-wide text-muted">
            © {new Date().getFullYear()} <a href="https://willsabol.com" className="text-gold hover:underline">Will Sabol</a>
          </p>
        </div>
        <nav className="flex flex-wrap gap-4">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="font-sans text-sm text-muted hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>
        <BuyMeACoffeeButton />
      </div>
    </footer>
  );
}
