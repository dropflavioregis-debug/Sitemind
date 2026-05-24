import SplitCompare from "../SplitCompare";
import type { SlideProps } from "./types";
import { pitch } from "../pitch-theme";

export default function Slide03Cost(_props: SlideProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className={pitch.slideTitle}>The disconnect between site and plan</h2>
      <SplitCompare
        leftTitle="What is happening on site"
        rightTitle="What managers think is happening"
        leftItems={[
          { label: "Delays accumulating" },
          { label: "Missing PPE on workers" },
          { label: "Late reporting from supervisors" },
        ]}
        rightItems={[
          { label: "On schedule" },
          { label: "Safety compliance verified" },
          { label: "Reports submitted on time" },
        ]}
        message="Decisions are made on outdated information"
      />
    </div>
  );
}
