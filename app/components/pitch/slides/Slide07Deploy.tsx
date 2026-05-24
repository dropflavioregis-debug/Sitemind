import { pitch } from "../pitch-theme";
import type { SlideProps } from "./types";

const options = [
  {
    title: "Use existing CCTV / cameras",
    description: "Connect feeds you already have on site",
  },
  {
    title: "Deploy SiteMind edge nodes",
    description: "ESP32 / rugged devices for remote zones",
  },
];

const icons = [
  { label: "CCTV", icon: CctvIcon },
  { label: "Drone", icon: DroneIcon },
  { label: "Device", icon: DeviceIcon },
  { label: "Cloud", icon: CloudIcon },
];

export default function Slide07Deploy(_props: SlideProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className={`${pitch.slideTitle} text-center`}>
        Works with existing infrastructure
      </h2>
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {options.map((o) => (
          <div key={o.title} className={pitch.card}>
            <p className={pitch.cardTitle}>{o.title}</p>
            <p className="text-slate-600">{o.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-8 md:gap-12 mt-10">
        {icons.map(({ label, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Icon />
            </div>
            <span className="text-xs font-medium text-slate-500">{label}</span>
          </div>
        ))}
      </div>
      <p className={`${pitch.keyLine} text-center`}>
        No rebuild required. Instant integration.
      </p>
    </div>
  );
}

function CctvIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function DroneIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  );
}
