import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type TooltipPosition = {
  arrowLeft: number;
  left: number;
  placement: "above" | "below";
  top: number;
};

type TooltipProps = {
  children: (props: { "aria-describedby": string }) => React.ReactNode;
  content: React.ReactNode;
};

const VIEWPORT_GUTTER = 12;
const TOOLTIP_GAP = 8;
const FADE_DURATION_MS = 400;

export function Tooltip({ children, content }: TooltipProps) {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOpenRef = useRef(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition | null>(null);

  const showTooltip = () => {
    isOpenRef.current = true;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    if (isRendered) {
      setIsVisible(true);
    } else {
      setIsRendered(true);
    }
  };

  const hideTooltip = () => {
    isOpenRef.current = false;
    setIsVisible(false);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setIsRendered(false), FADE_DURATION_MS);
  };

  useEffect(() => {
    if (!isRendered) return;

    const frame = requestAnimationFrame(() => {
      if (isOpenRef.current) setIsVisible(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [isRendered]);

  useEffect(() => () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  useLayoutEffect(() => {
    if (!isRendered) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;
      if (!trigger || !tooltip) return;

      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const triggerCenter = triggerRect.left + triggerRect.width / 2;
      const centeredLeft = triggerCenter - tooltipRect.width / 2;
      const maximumLeft = Math.max(VIEWPORT_GUTTER, window.innerWidth - tooltipRect.width - VIEWPORT_GUTTER);
      const left = Math.min(Math.max(centeredLeft, VIEWPORT_GUTTER), maximumLeft);
      const arrowLeft = Math.min(Math.max(triggerCenter - left, VIEWPORT_GUTTER), tooltipRect.width - VIEWPORT_GUTTER);
      const aboveTop = triggerRect.top - tooltipRect.height - TOOLTIP_GAP;
      const placement = aboveTop >= VIEWPORT_GUTTER ? "above" : "below";
      const top = placement === "above"
        ? aboveTop
        : triggerRect.bottom + TOOLTIP_GAP;

      setPosition({ arrowLeft, left, placement, top });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isRendered]);

  return (
    <span
      ref={triggerRef}
      className="inline"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) hideTooltip();
      }}
      onFocus={showTooltip}
      onKeyDown={(event) => {
        if (event.key === "Escape") hideTooltip();
      }}
      onMouseEnter={showTooltip}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) hideTooltip();
      }}
    >
      {children({ "aria-describedby": id })}
      {isRendered && typeof document !== "undefined" && createPortal(
        <span
          ref={tooltipRef}
          id={id}
          role="tooltip"
          className={`pointer-events-none fixed z-50 block w-max max-w-[min(20rem,calc(100vw-1.5rem))] rounded-md border border-line bg-dark px-3 py-2 font-sans text-xs font-normal leading-5 text-muted shadow-xl transition-opacity duration-150 ease-out motion-reduce:transition-none ${
            isVisible && position ? "opacity-100" : "opacity-0"
          }`}
          style={{
            left: position?.left ?? 0,
            top: position?.top ?? 0,
            visibility: position ? "visible" : "hidden",
          }}
        >
          {content}
          {position && (
            <span
              aria-hidden="true"
              className={`absolute size-2 -translate-x-1/2 rotate-45 border-line bg-dark ${
                position.placement === "above"
                  ? "top-full -translate-y-1/2 border-r border-b"
                  : "bottom-full translate-y-1/2 border-l border-t"
              }`}
              style={{ left: position.arrowLeft }}
            />
          )}
        </span>,
        document.body,
      )}
    </span>
  );
}
