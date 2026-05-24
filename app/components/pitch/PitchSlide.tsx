import type { ReactNode } from "react";

type PitchSlideProps = {
  children: ReactNode;
  className?: string;
};

export default function PitchSlide({ children, className = "" }: PitchSlideProps) {
  return (
    <section
      className={`h-full w-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 ${className}`}
    >
      {children}
    </section>
  );
}
