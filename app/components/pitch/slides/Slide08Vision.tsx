import { pitch } from "../pitch-theme";
import type { SlideProps } from "./types";

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
            <div className="h-12 rounded-lg bg-blue-500/30 border border-blue-400/50 backdrop-blur-sm" />
            <div className="h-12 rounded-lg bg-emerald-500/30 border border-emerald-400/50 backdrop-blur-sm" />
            <div className="h-12 rounded-lg bg-amber-500/30 border border-amber-400/50 backdrop-blur-sm" />
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
