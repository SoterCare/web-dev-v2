"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

// Below the breakpoint the cards form a swipeable, snapping row with a position indicator.
// From the breakpoint up they drop back into the grid described by `gridClassName`.
// Tailwind only sees complete class names, so every variant is written out here.
const BREAKPOINTS = {
  sm: {
    track: "max-sm:-mx-4 max-sm:px-4 sm:grid sm:overflow-visible sm:snap-none sm:py-0 sm:my-0",
    slide: "sm:w-auto sm:shrink sm:snap-align-none",
    indicator: "sm:hidden",
  },
  md: {
    track: "max-sm:-mx-4 max-sm:px-4 sm:max-md:-mx-6 sm:max-md:px-6 md:grid md:overflow-visible md:snap-none md:py-0 md:my-0",
    slide: "md:w-auto md:shrink md:snap-align-none",
    indicator: "md:hidden",
  },
  lg: {
    track: "max-sm:-mx-4 max-sm:px-4 sm:max-lg:-mx-6 sm:max-lg:px-6 lg:grid lg:overflow-visible lg:snap-none lg:py-0 lg:my-0",
    slide: "lg:w-auto lg:shrink lg:snap-align-none",
    indicator: "lg:hidden",
  },
} as const;

interface CardSliderProps {
  children: ReactNode;
  /** Where the slider turns back into a grid. */
  breakpoint: keyof typeof BREAKPOINTS;
  /** Layout from the breakpoint up, e.g. "md:grid-cols-3 md:gap-6". */
  gridClassName: string;
  /** Width of each card while sliding. Leave a sliver of the next card showing. */
  slideClassName?: string;
  label: string;
}

export default function CardSlider({
  children,
  breakpoint,
  gridClassName,
  slideClassName = "w-[84%]",
  label,
}: CardSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const bp = BREAKPOINTS[breakpoint];
  const slides = Children.toArray(children).filter(isValidElement) as ReactElement<{
    className?: string;
  }>[];
  const total = slides.length;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;
    // At the ends the nearest-centre rule can pick the wrong card, so pin them.
    if (track.scrollLeft <= 2) return setActive(0);
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) {
      return setActive(track.children.length - 1);
    }
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    Array.from(track.children).forEach((el, i) => {
      const card = el as HTMLElement;
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const card = track?.children[i] as HTMLElement | undefined;
    if (!track || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <div>
      <div
        ref={trackRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        className={`relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain -my-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${bp.track} ${gridClassName}`}
      >
        {slides.map((slide, i) =>
          cloneElement(slide, {
            key: slide.key ?? i,
            className: `${slide.props.className ?? ""} ${slideClassName} shrink-0 snap-center ${bp.slide}`,
          }),
        )}
      </div>

      {total > 1 && (
        <div className={`mt-5 flex flex-col items-center gap-2 ${bp.indicator}`}>
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show card ${i + 1} of ${total}`}
                aria-current={i === active}
                className="flex h-6 items-center"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    i === active ? "w-7 bg-[#3d7e93]" : "w-2 bg-black/15"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold text-text-muted">
            {active + 1} of {total}
          </p>
        </div>
      )}
    </div>
  );
}
