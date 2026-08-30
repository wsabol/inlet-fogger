import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV } from "../nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex min-w-0 items-baseline gap-2 tracking-wide" onClick={() => setOpen(false)}>
          <span className="font-sans text-sm font-semibold uppercase text-gold">Inlet Fogging</span>
          <span className="hidden truncate font-sans text-sm uppercase text-muted sm:inline">
            Engineering Reference
          </span>
        </Link>
        <button
          type="button"
          className="font-sans text-sm uppercase tracking-wider text-cream md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav className="hidden items-center gap-5 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `font-sans text-sm tracking-wide ${
                  isActive ? "text-gold underline decoration-gold/80 underline-offset-8" : "text-cream/80 hover:text-gold"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      {open && (
        <nav className="flex flex-col gap-3 border-t border-line px-5 py-4 md:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `font-sans text-sm ${isActive ? "text-gold" : "text-cream/80"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
