"use client";

import { useEffect, useState } from "react";
import LiveCamera from "../../LiveCamera";
import { pitch } from "../pitch-theme";
import type { SlideProps } from "./types";

export default function Slide05LiveDemo({ isActive = false }: SlideProps) {
  const [progressPct, setProgressPct] = useState(67);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setProgressPct((p) => (p >= 92 ? 67 : p + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className={`${pitch.slideTitle} text-center mb-8`}>
        Real-time site intelligence
      </h2>
      <div className="grid lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <DemoTile
            label="PPE detection"
            status="safe / unsafe"
            icon={<PpeIcon />}
            tone="blue"
          />
          <DemoTile
            label="Hazard detection"
            status="alert"
            icon={<HazardIcon />}
            tone="red"
          />
          <DemoTile
            label="Progress tracking"
            status={`${progressPct}% updated`}
            icon={<ProgressIcon />}
            tone="emerald"
          />
        </div>
        <div className="lg:col-span-3">
          <LiveCamera variant="embed" lockedModel="ppe" isActive={isActive} />
        </div>
      </div>
    </div>
  );
}

function DemoTile({
  label,
  status,
  icon,
  tone,
}: {
  label: string;
  status: string;
  icon: React.ReactNode;
  tone: "blue" | "red" | "emerald";
}) {
  const colors = {
    blue: "border-blue-200 bg-blue-50",
    red: "border-red-200 bg-red-50",
    emerald: "border-emerald-200 bg-emerald-50",
  };
  const iconColors = {
    blue: "text-blue-600",
    red: "text-red-600",
    emerald: "text-emerald-600",
  };
  return (
    <div className={`rounded-xl border-2 ${colors[tone]} p-4 flex items-center gap-4`}>
      <div className={`${iconColors[tone]} shrink-0`}>{icon}</div>
      <div>
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="text-sm text-slate-600 capitalize">{status}</p>
      </div>
    </div>
  );
}

function PpeIcon() {
  return (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function HazardIcon() {
  return (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
