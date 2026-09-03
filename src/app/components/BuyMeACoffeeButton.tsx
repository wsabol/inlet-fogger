import { useEffect, useRef } from "react";

const BUTTON_SCRIPT = "https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js";

export function BuyMeACoffeeButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (container.querySelector(`script[src="${BUTTON_SCRIPT}"]`)) return;

    const script = document.createElement("script");
    script.src = BUTTON_SCRIPT;
    script.async = true;
    script.dataset.name = "bmc-button";
    script.dataset.slug = "willsabol";
    script.dataset.color = "#c5a572";
    script.dataset.emoji = "";
    script.dataset.font = "Cookie";
    script.dataset.text = "Buy me a coffee";
    script.dataset.outlineColor = "#000000";
    script.dataset.fontColor = "#e8e4d9";
    script.dataset.coffeeColor = "#FFDD00";

    const handleLoad = () => {
      if (container.querySelectorAll("a").length > 1 && fallbackRef.current) {
        fallbackRef.current.hidden = true;
      }
    };
    script.addEventListener("load", handleLoad);
    container.appendChild(script);
  }, []);

  return (
    <div ref={containerRef} className="min-h-12 shrink-0">
      <a
        ref={fallbackRef}
        href="https://www.buymeacoffee.com/willsabol"
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-12 items-center gap-2 rounded-lg border border-black bg-[#c5a572] px-4 text-xl text-cream shadow-sm transition-transform hover:-translate-y-0.5"
        style={{ fontFamily: '"Cookie", cursive' }}
      >
        <span aria-hidden="true" className="text-2xl">
          ☕
        </span>
        Buy me a coffee
      </a>
    </div>
  );
}
