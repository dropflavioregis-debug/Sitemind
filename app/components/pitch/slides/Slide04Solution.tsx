import FlowDiagram from "../FlowDiagram";
import type { SlideProps } from "./types";
import { pitch } from "../pitch-theme";

export default function Slide04Solution(_props: SlideProps) {
  return (
    <div className="w-full max-w-5xl mx-auto text-center">
      <h2 className={pitch.slideTitle}>SiteMind closes the loop</h2>
      <div className="mt-10 mb-8">
        <FlowDiagram />
      </div>
      <p className={pitch.keyLine}>
        From physical reality → to live project intelligence
      </p>
    </div>
  );
}
