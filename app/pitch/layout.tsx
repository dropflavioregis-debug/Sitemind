import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SiteMind — Pitch Deck",
  description: "AI-powered construction site intelligence",
};

export default function PitchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {children}
    </div>
  );
}
