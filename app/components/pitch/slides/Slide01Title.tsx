import DashboardMockup from "../DashboardMockup";
import type { SlideProps } from "./types";
import { pitch } from "../pitch-theme";

export default function Slide01Title(_props: SlideProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center w-full max-w-6xl mx-auto">
      <div>
        <h1 className={pitch.title}>
          <span className="text-blue-600">Site</span>Mind
        </h1>
        <p className={`${pitch.subtitle} mt-4`}>
          AI-powered construction site intelligence
        </p>
        <p className={`${pitch.tagline} mt-6 max-w-md`}>
          Connecting safety, compliance, and project progress in real time
        </p>
      </div>
      <DashboardMockup />
    </div>
  );
}
