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

type TooltipStyle = React.CSSProperties & {
  "--arrow-left": string;
  "--tooltip-left": string;
  "--tooltip-top": string;
};

const VIEWPORT_GUTTER = 12;
const TOOLTIP_GAP = 8;
const FADE_FALLBACK_MS = 400;

function getTooltipFadeMs(tooltip: HTMLElement | null) {
  if (!tooltip) return FADE_FALLBACK_MS;

  const raw = getComputedStyle(tooltip).getPropertyValue("--tooltip-fade").trim();
  const parsed = Number.parseFloat(raw);
  if (Number.isNaN(parsed)) return FADE_FALLBACK_MS;
  if (raw.endsWith("ms")) return parsed;
  if (raw.endsWith("s")) return parsed * 1000;
  return parsed;
}

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
    hideTimerRef.current = setTimeout(
      () => setIsRendered(false),
      getTooltipFadeMs(tooltipRef.current),
    );
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

  const tooltipStyle: TooltipStyle = {
    "--arrow-left": `${position?.arrowLeft ?? 0}px`,
    "--tooltip-left": `${position?.left ?? 0}px`,
    "--tooltip-top": `${position?.top ?? 0}px`,
  };

  return (
    <span
      ref={triggerRef}
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
          className="tooltip"
          data-placed={position ? true : undefined}
          data-visible={isVisible && position ? true : undefined}
          data-placement={position?.placement}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          style={tooltipStyle}
        >
          {content}
        </span>,
        document.body,
      )}
    </span>
  );
}
