"use client";

import { useCallback, useEffect, useState, type ComponentType } from "react";
import type { SlideProps } from "./slides/types";
import PitchSlide from "./PitchSlide";
import Slide01Title from "./slides/Slide01Title";
import Slide02Problem from "./slides/Slide02Problem";
import Slide03Cost from "./slides/Slide03Cost";
import Slide04Solution from "./slides/Slide04Solution";
import Slide05LiveDemo from "./slides/Slide05LiveDemo";
import Slide06Outcomes from "./slides/Slide06Outcomes";
import Slide07Deploy from "./slides/Slide07Deploy";
import Slide08Vision from "./slides/Slide08Vision";

const SLIDE_COUNT = 8;

const slides: ComponentType<SlideProps>[] = [
  Slide01Title,
  Slide02Problem,
  Slide03Cost,
  Slide04Solution,
  Slide05LiveDemo,
  Slide06Outcomes,
  Slide07Deploy,
  Slide08Vision,
];

function parseHashSlide(): number | null {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#slide-(\d+)$/);
  if (!match) return null;
  const n = parseInt(match[1], 10);
  if (n >= 1 && n <= SLIDE_COUNT) return n - 1;
  return null;
}

export default function SlideDeck() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(SLIDE_COUNT - 1, index));
    setCurrent(clamped);
    window.history.replaceState(null, "", `#slide-${clamped + 1}`);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const fromHash = parseHashSlide();
    if (fromHash !== null) setCurrent(fromHash);

    const onHashChange = () => {
      const h = parseHashSlide();
      if (h !== null) setCurrent(h);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(SLIDE_COUNT - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo]);

  const SlideComponent = slides[current];

  return (
    <div className="h-screen w-screen overflow-hidden bg-white relative">
      <div className="h-full w-full transition-opacity duration-300">
        <PitchSlide key={current}>
          <SlideComponent isActive={current === 4} />
        </PitchSlide>
      </div>

      <nav className="fixed bottom-6 left-0 right-0 flex items-center justify-center gap-4 z-50 pointer-events-none">
        <button
          type="button"
          onClick={prev}
          disabled={current === 0}
          className="pointer-events-auto p-2 rounded-full bg-white/90 border border-slate-200 shadow-md text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft />
        </button>

        <div className="flex items-center gap-2 pointer-events-auto">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === current
                  ? "w-6 bg-blue-600"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          disabled={current === SLIDE_COUNT - 1}
          className="pointer-events-auto p-2 rounded-full bg-white/90 border border-slate-200 shadow-md text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight />
        </button>
      </nav>

      <div className="fixed top-4 right-6 text-xs text-slate-400 font-medium z-50">
        {current + 1} / {SLIDE_COUNT}
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
