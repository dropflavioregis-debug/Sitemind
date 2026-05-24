import { pitch } from "../pitch-theme";
import type { SlideProps } from "./types";

const outcomes = [
  {
    title: "Fewer preventable incidents",
    icon: ShieldIcon,
  },
  {
    title: "Faster project updates",
    icon: SpeedIcon,
  },
  {
    title: "Reduced site coordination overhead",
    icon: CoordIcon,
  },
];

export default function Slide06Outcomes(_props: SlideProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className={`${pitch.slideTitle} text-center`}>
        Not just safety — productivity + control
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {outcomes.map((o) => (
          <div key={o.title} className={pitch.card}>
            <div className="text-blue-600 mb-4">
              <o.icon />
            </div>
            <p className={pitch.cardTitle}>{o.title}</p>
          </div>
        ))}
      </div>
      <p className={`${pitch.keyLine} text-center`}>
        One system replacing fragmented reporting
      </p>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function SpeedIcon() {
  return (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function CoordIcon() {
  return (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
