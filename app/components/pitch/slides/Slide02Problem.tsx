import Image from "next/image";
import { pitch } from "../pitch-theme";
import type { SlideProps } from "./types";

const CONSTRUCTION_SITE_IMAGE = "/images/ppe7.jpg";

const bullets = [
  "Injuries and fatalities are preventable — Australia loses ~169 workers per year",
  "Safety checks are manual and inconsistent",
  "Project progress is based on delayed reporting",
  "Projects consistently run over budget and over time",
];

export default function Slide02Problem(_props: SlideProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center w-full max-w-6xl mx-auto">
      <div>
        <h2 className={pitch.slideTitle}>Construction sites are blind</h2>
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
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg bg-slate-900">
        <Image
          src={CONSTRUCTION_SITE_IMAGE}
          alt="Construction site with AI PPE detection overlays"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
