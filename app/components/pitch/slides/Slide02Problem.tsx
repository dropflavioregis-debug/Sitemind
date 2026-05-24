import { pitch } from "../pitch-theme";
import type { SlideProps } from "./types";

const bullets = [
  "Fatalities and injuries are still preventable",
  "Safety checks are manual and inconsistent",
  "Project progress is based on delayed reporting",
];

export default function Slide02Problem(_props: SlideProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center w-full max-w-6xl mx-auto">
      <div>
        <h2 className={pitch.slideTitle}>Construction sites are still reactive</h2>
        <p className="text-sm text-blue-600 font-medium mb-6">Australia</p>
        <ul className="space-y-4">
          {bullets.map((b) => (
            <li key={b} className={pitch.bullet}>
              <span className={pitch.bulletDot} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
          alt="Construction site"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-red-600/10 pointer-events-none" />
        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          WARNING
        </div>
        <div className="absolute bottom-4 right-4 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-md">
          PPE VIOLATION
        </div>
        <div className="absolute top-1/3 right-8 w-24 h-24 border-2 border-red-500 rounded-lg opacity-80" />
      </div>
    </div>
  );
}
