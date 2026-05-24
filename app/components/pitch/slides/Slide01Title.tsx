import DashboardTableMockup from "../DashboardTableMockup";
import type { SlideProps } from "./types";
import { pitch } from "../pitch-theme";

export default function Slide01Title(_props: SlideProps) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <div className="text-center lg:text-left">
        <h1 className={pitch.title}>
          <span className="text-blue-600">Site</span>Mind
        </h1>
        <p className={`${pitch.subtitle} mt-4`}>
          AI-powered construction site intelligence
        </p>
        <p className={`${pitch.tagline} mt-4 max-w-2xl mx-auto lg:mx-0`}>
          Connecting safety, compliance, and project progress in real time
        </p>
      </div>
      <DashboardTableMockup className="w-full h-[min(52vh,420px)] min-h-[280px]" />
    </div>
  );
}
