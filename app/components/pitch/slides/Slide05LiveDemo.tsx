"use client";

import Link from "next/link";
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
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <CameraIcon />
            Open live camera demo
          </Link>
        </div>
        <div className="lg:col-span-3">
          <LiveCamera
            variant="embed"
            lockedModel="ppe"
            isActive={isActive}
            fallbackImage="/images/ppe-detection-camera.png"
          />
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

function CameraIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
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
