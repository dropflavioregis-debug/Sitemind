import { pitch } from "../pitch-theme";
import type { SlideProps } from "./types";

const visionFeatures = [
  {
    label: "Live intelligence overlay",
    icon: OverlayIcon,
    className: "bg-blue-500/30 border-blue-400/50 text-blue-100",
  },
  {
    label: "Real-time risk map",
    icon: RiskMapIcon,
    className: "bg-emerald-500/30 border-emerald-400/50 text-emerald-100",
  },
  {
    label: "Measurable progress",
    icon: ProgressIcon,
    className: "bg-amber-500/30 border-amber-400/50 text-amber-100",
  },
] as const;

export default function Slide08Vision(_props: SlideProps) {
  return (
    <div className="w-full max-w-5xl mx-auto text-center relative">
      <h2 className={pitch.slideTitle}>The digital twin of every construction site</h2>
      <div className="relative mt-10 rounded-2xl overflow-hidden aspect-video max-w-3xl mx-auto shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80"
          alt="Construction site aerial"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-6">
            {visionFeatures.map(({ label, icon: Icon, className }) => (
              <div
                key={label}
                className={`h-12 rounded-lg border backdrop-blur-sm flex items-center justify-center ${className}`}
                title={label}
                aria-label={label}
              >
                <Icon />
              </div>
            ))}
          </div>
          <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed max-w-lg">
            Live intelligence overlay · Real-time risk map · Measurable progress
          </p>
        </div>
      </div>
      <p className="text-lg md:text-xl text-slate-700 font-medium mt-10 max-w-3xl mx-auto leading-relaxed">
        Every camera becomes intelligence. Every site becomes measurable. Every
        risk becomes visible in real time.
      </p>
    </div>
  );
}

function OverlayIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6.75 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V6.75a3 3 0 00-3-3H6.75z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12.75l2.25 2.25L15 9.75M12 3v2.25M12 18.75V21M3 12h2.25M18.75 12H21"
      />
    </svg>
  );
}

function RiskMapIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934a1.125 1.125 0 01-1.006 0L9.75 3.75 4.502 6.252c-.38.19-.622.58-.622 1.006v8.226c0 .427.24.816.622 1.006l4.875 2.437a1.125 1.125 0 001.006 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3l1.5 1.5" />
    </svg>
  );
}

function ProgressIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    </svg>
  );
}
