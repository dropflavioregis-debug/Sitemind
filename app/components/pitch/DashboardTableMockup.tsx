"use client";

import Image from "next/image";

const PPE_FEED_IMAGE = "/images/ppe-worker-feed.png";

type DashboardTableMockupProps = {
  className?: string;
};

const GANTT_PHASES = [
  { name: "Prelim", color: "#534AB7", start: 0, width: 14 },
  { name: "Structure", color: "#185FA5", start: 12, width: 22 },
  { name: "Envelope", color: "#0F6E56", start: 32, width: 18 },
  { name: "Fit-out", color: "#BA7517", start: 48, width: 24 },
  { name: "Finishes", color: "#993C1D", start: 70, width: 16 },
  { name: "Commission", color: "#993556", start: 84, width: 12 },
];

const INCIDENTS = [
  { zone: "Zone B · L3", type: "Trip hazard", status: "Open", tone: "red" as const, time: "14:28" },
  { zone: "Zone A · Entry", type: "Missing hard hat", status: "Resolved", tone: "green" as const, time: "14:22" },
  { zone: "Zone C · Plant", type: "Exclusion breach", status: "Monitoring", tone: "yellow" as const, time: "14:15" },
];

const COMPLIANCE = [
  { action: "PPE scan logged — Zone A", time: "14:31:02", evidence: true },
  { action: "SWMS acknowledgement — electrical", time: "14:29:44", evidence: true },
  { action: "Daily pre-start — crew 12", time: "14:18:11", evidence: false },
];

export default function DashboardTableMockup({ className = "" }: DashboardTableMockupProps) {
  return (
    <div
      className={`rounded-[11px] border border-[#e4e2db] bg-[#f0efe9] shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col ${className}`}
      style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif" }}
    >
      <Topbar />

      <div
        className="grid flex-1 min-h-0 gap-2.5 p-2.5"
        style={{
          gridTemplateColumns: "1fr 0.85fr 1.55fr",
          gridTemplateRows: "1fr 88px",
        }}
      >
        <CameraCard className="row-start-1 col-start-1" />
        <AlertsCard className="row-start-1 col-start-2" />
        <ProgrammeCard className="row-start-1 col-start-3" />
        <ComplianceCard className="row-start-2 col-span-3" />
      </div>
    </div>
  );
}

function Topbar() {
  return (
    <div className="h-10 px-3 bg-white border-b border-[#e4e2db] flex items-center justify-between shrink-0 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-[#18181a] rounded-[6px] grid grid-cols-2 gap-[3px] p-1.5">
          <span className="bg-white rounded-[1px]" />
          <span className="bg-white rounded-[1px]" />
          <span className="bg-[#f97316] rounded-[1px]" />
          <span className="bg-white rounded-[1px]" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-[#18181a]">
          Site<span className="text-[#f97316]">mind</span>
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-2 bg-[#f8f7f4] border border-[#e4e2db] rounded-lg px-2.5 py-1 text-[11px] text-[#5f5e58]">
        <span>Sydney Site #42</span>
        <span className="w-[3px] h-[3px] rounded-full bg-[#ccc9bf]" />
        <span>Zone A · Cam 01</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 bg-[#f0fdf4] border border-[#86efac] rounded-full px-2 py-0.5 text-[10px] font-semibold text-[#16a34a]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          LIVE
        </span>
        <span
          className="font-mono text-[10px] text-[#5f5e58] hidden sm:block"
          style={{ fontFamily: "var(--font-dm-mono), 'DM Mono', monospace" }}
        >
          14:32:08
        </span>
      </div>
    </div>
  );
}

function CardShell({
  title,
  badge,
  children,
  className = "",
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-[9px] border border-[#e4e2db] shadow-sm flex flex-col overflow-hidden min-h-0 ${className}`}
    >
      <div className="px-2.5 py-1.5 border-b border-[#e4e2db] flex items-center justify-between shrink-0">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-[#5f5e58]">
          {title}
        </span>
        {badge}
      </div>
      {children}
    </div>
  );
}

function CameraCard({ className }: { className?: string }) {
  return (
    <CardShell
      className={className}
      title="Live feed"
      badge={
        <span className="flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[#fffbeb] text-[#d97706]">
          <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
          PPE scan
        </span>
      }
    >
      <div className="relative flex-1 min-h-[100px] bg-[#1c1b16]">
        <Image
          src={PPE_FEED_IMAGE}
          alt="Industrial worker with PPE detection overlays on a construction site feed"
          fill
          className="object-cover object-[center_20%]"
          sizes="(max-width: 1024px) 33vw, 280px"
          priority
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,.35) 0%, transparent 28%, transparent 72%, rgba(0,0,0,.45) 100%)",
          }}
        />
        <div className="absolute top-2 left-2 flex items-center gap-1 text-[8px] font-semibold text-white/80 tracking-wider z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
          REC
        </div>
        <div className="absolute top-2 right-2 z-10 bg-black/65 border border-white/10 rounded px-1.5 py-0.5 text-[8px] text-white/90 backdrop-blur-sm">
          PPE · 142ms
        </div>
        <span
          className="absolute bottom-1.5 left-2 z-10 text-[8px] text-white/70 drop-shadow-sm"
          style={{ fontFamily: "var(--font-dm-mono), monospace" }}
        >
          2026-05-24 14:32:08
        </span>
      </div>
      <div className="grid grid-cols-3 border-t border-[#e4e2db] shrink-0">
        <MiniStat label="Scans" value="847" />
        <MiniStat label="Objects" value="3" />
        <MiniStat label="Latency" value="142ms" />
      </div>
    </CardShell>
  );
}

function AlertsCard({ className }: { className?: string }) {
  return (
    <CardShell className={className} title="Alerts">
      <div className="flex-1 p-1.5 space-y-1 overflow-hidden min-h-0">
        <AlertRow tone="critical" icon="⚠" title="Zone B hazard" desc="Unsecured scaffolding" time="14:28" loc="Cam 03" />
        <AlertRow tone="warning" icon="◆" title="Benchtop obstruction" desc="Clearance &lt; 600mm" time="14:26" loc="Zone A" />
        <AlertRow tone="milestone" icon="★" title="Level 3 milestone" desc="Framing 67% complete" time="14:25" loc="Programme" />
        <AlertRow tone="resolved" icon="✓" title="PPE cleared" desc="Zone A all compliant" time="14:22" loc="Cam 01" />
      </div>
      <div className="grid grid-cols-3 gap-1 p-1.5 border-t border-[#e4e2db] shrink-0">
        <CountChip n={1} label="Critical" tone="red" />
        <CountChip n={2} label="Warning" tone="yellow" />
        <CountChip n={4} label="Resolved" tone="green" />
      </div>
    </CardShell>
  );
}

function ProgrammeCard({ className }: { className?: string }) {
  return (
    <CardShell
      className={className}
      title="Programme & safety"
      badge={
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[#eff6ff] text-[#2563eb]">
          Week 18
        </span>
      }
    >
      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-2 border-b border-[#e4e2db] shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[8px] uppercase tracking-wide text-[#9e9b93] font-medium">
              Construction phases
            </span>
            <span
              className="text-[8px] text-[#5f5e58]"
              style={{ fontFamily: "var(--font-dm-mono), monospace" }}
            >
              Today ▼
            </span>
          </div>
          <div className="relative h-6 bg-[#f8f7f4] rounded border border-[#e4e2db] overflow-hidden">
            {GANTT_PHASES.map((p) => (
              <div
                key={p.name}
                className="absolute top-1 bottom-1 rounded-sm opacity-90"
                style={{
                  left: `${p.start}%`,
                  width: `${p.width}%`,
                  backgroundColor: p.color,
                }}
                title={p.name}
              />
            ))}
            <div
              className="absolute top-0 bottom-0 w-px bg-[#18181a]/40 z-10"
              style={{ left: "52%" }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {GANTT_PHASES.map((p) => (
              <span key={p.name} className="flex items-center gap-1 text-[7px] text-[#5f5e58]">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: p.color }} />
                {p.name}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 border-b border-[#e4e2db] shrink-0">
          <SafetyStat label="Open" value="1" tone="red" sub="incidents" />
          <SafetyStat label="PPE" value="94%" tone="green" sub="compliance" />
          <SafetyStat label="Behind" value="2d" tone="yellow" sub="programme" />
          <SafetyStat label="On site" value="47" tone="default" sub="workers" />
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-2.5 py-1 bg-[#f8f7f4] border-b border-[#e4e2db] text-[8px] font-semibold uppercase tracking-wide text-[#5f5e58] shrink-0">
            Active incidents
          </div>
          <div className="overflow-hidden flex-1">
            <table className="w-full text-[9px]">
              <thead>
                <tr className="text-[#9e9b93] border-b border-[#e4e2db]">
                  <th className="text-left font-medium px-2 py-1">Zone</th>
                  <th className="text-left font-medium px-1 py-1">Type</th>
                  <th className="text-left font-medium px-1 py-1">Status</th>
                  <th className="text-right font-medium px-2 py-1">Time</th>
                </tr>
              </thead>
              <tbody>
                {INCIDENTS.map((row) => (
                  <tr key={row.zone + row.time} className="border-b border-[#e4e2db]/60 last:border-0">
                    <td className="px-2 py-1 text-[#18181a] font-medium">{row.zone}</td>
                    <td className="px-1 py-1 text-[#5f5e58]">{row.type}</td>
                    <td className="px-1 py-1">
                      <StatusPill tone={row.tone} label={row.status} />
                    </td>
                    <td
                      className="px-2 py-1 text-right text-[#9e9b93]"
                      style={{ fontFamily: "var(--font-dm-mono), monospace" }}
                    >
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function ComplianceCard({ className }: { className?: string }) {
  return (
    <CardShell className={className} title="Compliance log — auto-captured">
      <div className="flex-1 flex items-stretch divide-x divide-[#e4e2db] min-h-0 overflow-hidden">
        {COMPLIANCE.map((entry) => (
          <div key={entry.time} className="flex-1 px-2.5 py-1.5 flex flex-col justify-center min-w-0">
            <p className="text-[9px] text-[#18181a] font-medium truncate">{entry.action}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="text-[8px] text-[#9e9b93]"
                style={{ fontFamily: "var(--font-dm-mono), monospace" }}
              >
                {entry.time}
              </span>
              {entry.evidence && (
                <span className="text-[7px] font-semibold uppercase tracking-wide text-[#16a34a] bg-[#f0fdf4] border border-[#86efac] rounded px-1">
                  evidence
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1 border-r border-[#e4e2db] last:border-r-0">
      <p className="text-[7px] uppercase tracking-wide text-[#9e9b93] font-medium">{label}</p>
      <p
        className="text-[11px] font-medium text-[#18181a]"
        style={{ fontFamily: "var(--font-dm-mono), monospace" }}
      >
        {value}
      </p>
    </div>
  );
}

function AlertRow({
  tone,
  icon,
  title,
  desc,
  time,
  loc,
}: {
  tone: "critical" | "warning" | "resolved" | "milestone";
  icon: string;
  title: string;
  desc: string;
  time: string;
  loc: string;
}) {
  const styles = {
    critical: "bg-[#fef2f2] border-[#fecaca]",
    warning: "bg-[#fffbeb] border-[#fde68a]",
    resolved: "bg-[#f0fdf4] border-[#86efac] opacity-75",
    milestone: "bg-[#fdf4ff] border-[#e9d5ff]",
  };
  const titleColors = {
    critical: "text-[#dc2626]",
    warning: "text-[#d97706]",
    resolved: "text-[#16a34a]",
    milestone: "text-[#7c3aed]",
  };
  return (
    <div className={`rounded-lg border px-2 py-1 flex gap-1.5 ${styles[tone]}`}>
      <span className="text-[11px] shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`text-[9px] font-semibold ${titleColors[tone]}`}>{title}</p>
        <p className="text-[8px] text-[#5f5e58] leading-snug">{desc}</p>
        <div className="flex gap-1.5 mt-0.5">
          <span
            className="text-[7px] text-[#9e9b93]"
            style={{ fontFamily: "var(--font-dm-mono), monospace" }}
          >
            {time}
          </span>
          <span className="text-[7px] text-[#9e9b93]">· {loc}</span>
        </div>
      </div>
    </div>
  );
}

function CountChip({
  n,
  label,
  tone,
}: {
  n: number;
  label: string;
  tone: "red" | "yellow" | "green";
}) {
  const styles = {
    red: "bg-[#fef2f2] border-[#fecaca] text-[#dc2626]",
    yellow: "bg-[#fffbeb] border-[#fde68a] text-[#d97706]",
    green: "bg-[#f0fdf4] border-[#86efac] text-[#16a34a]",
  };
  return (
    <div className={`rounded-lg border text-center py-0.5 ${styles[tone]}`}>
      <span
        className="text-xs font-medium block leading-none"
        style={{ fontFamily: "var(--font-dm-mono), monospace" }}
      >
        {n}
      </span>
      <span className="text-[7px] font-semibold uppercase tracking-wide">{label}</span>
    </div>
  );
}

function SafetyStat({
  label,
  value,
  tone,
  sub,
}: {
  label: string;
  value: string;
  tone: "red" | "green" | "yellow" | "default";
  sub: string;
}) {
  const valueColors = {
    red: "text-[#dc2626]",
    green: "text-[#16a34a]",
    yellow: "text-[#d97706]",
    default: "text-[#18181a]",
  };
  return (
    <div className="px-2 py-1.5 border-r border-[#e4e2db] last:border-r-0">
      <p className="text-[7px] uppercase tracking-wide text-[#9e9b93] font-medium">{label}</p>
      <p
        className={`text-base font-medium leading-none ${valueColors[tone]}`}
        style={{ fontFamily: "var(--font-dm-mono), monospace" }}
      >
        {value}
      </p>
      <p className="text-[7px] text-[#9e9b93] mt-0.5">{sub}</p>
    </div>
  );
}

function StatusPill({ tone, label }: { tone: "red" | "green" | "yellow"; label: string }) {
  const styles = {
    red: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
    green: "bg-[#f0fdf4] text-[#16a34a] border-[#86efac]",
    yellow: "bg-[#fffbeb] text-[#d97706] border-[#fde68a]",
  };
  return (
    <span className={`inline-block text-[8px] font-semibold px-1.5 py-0.5 rounded border ${styles[tone]}`}>
      {label}
    </span>
  );
}
