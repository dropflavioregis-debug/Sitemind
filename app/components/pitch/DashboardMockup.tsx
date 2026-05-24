type DashboardMockupProps = {
  compact?: boolean;
};

export default function DashboardMockup({ compact = false }: DashboardMockupProps) {
  return (
    <div
      className={`rounded-[11px] border border-[#e4e2db] bg-[#f0efe9] shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden ${
        compact ? "w-full" : "w-full max-w-2xl"
      }`}
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Topbar */}
      <div className="h-10 px-3 bg-white border-b border-[#e4e2db] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#18181a] rounded-[5px] grid grid-cols-2 gap-[2px] p-1">
            <span className="bg-white rounded-[1px]" />
            <span className="bg-white rounded-[1px]" />
            <span className="bg-[#f97316] rounded-[1px]" />
            <span className="bg-white rounded-[1px]" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#18181a]">
            Site<span className="text-[#f97316]">mind</span>
          </span>
        </div>
        {!compact && (
          <div className="hidden sm:flex items-center gap-1.5 bg-[#f8f7f4] border border-[#e4e2db] rounded-lg px-2 py-0.5 text-[10px] text-[#5f5e58]">
            <span>Zone A</span>
            <span className="w-[3px] h-[3px] rounded-full bg-[#ccc9bf]" />
            <span>Cam 01</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-[#fef2f2] border border-[#fecaca] rounded-full px-2 py-0.5 text-[10px] font-semibold text-[#dc2626]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
            LIVE
          </span>
          {!compact && (
            <span className="font-mono text-[10px] text-[#5f5e58] hidden sm:block">
              14:32:08
            </span>
          )}
        </div>
      </div>

      {/* Workspace */}
      <div
        className={`grid gap-1.5 p-1.5 ${
          compact ? "grid-cols-1" : "grid-cols-[1.2fr_0.85fr]"
        }`}
      >
        {/* Camera card */}
        <div className="bg-white rounded-[9px] border border-[#e4e2db] overflow-hidden flex flex-col min-h-0 shadow-sm">
          <div className="px-2.5 py-1.5 border-b border-[#e4e2db] flex items-center justify-between">
            <span className="text-[9px] font-semibold uppercase tracking-wide text-[#5f5e58]">
              Live feed
            </span>
            <span className="flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a]">
              <span className="w-1 h-1 rounded-full bg-current" />
              PPE OK
            </span>
          </div>
          <div className="relative flex-1 min-h-[120px] bg-[#1c1b16] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 35% 45%, rgba(251,191,36,.07) 0%, transparent 60%), linear-gradient(180deg, #242318 0%, #181710 100%)",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-[55%] opacity-80 bg-[linear-gradient(180deg,#1e1d14_0%,#232216_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 h-[48%] opacity-60 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.025)_0_1px,transparent_1px_55px)]" />

            {/* Person silhouette */}
            <div className="absolute bottom-[38%] left-[36%]">
              <div className="relative w-[22px] h-[22px] rounded-full bg-[rgba(210,185,155,.75)] mx-auto">
                <div className="absolute -top-2 -left-1 -right-1 h-3.5 bg-[rgba(249,115,22,.95)] rounded-t-full rounded-b-sm" />
              </div>
              <div className="w-8 h-4 bg-[rgba(249,115,22,.6)] rounded-t mx-auto mt-0.5" />
              <div className="w-8 h-8 bg-[rgba(100,120,140,.6)] rounded-b mx-auto" />
            </div>

            {/* Detection box */}
            <div className="absolute bottom-[34%] left-[32%] w-14 h-20 border-2 border-[#22c55e] rounded shadow-[inset_0_0_16px_rgba(34,197,94,.06)]">
              <span className="absolute -top-4 left-0 text-[8px] font-semibold bg-[#22c55e] text-white px-1.5 py-0.5 rounded">
                hardhat 94%
              </span>
            </div>

            {/* REC + corners */}
            <div className="absolute top-2 left-2 flex items-center gap-1 text-[8px] font-semibold text-white/80 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              REC
            </div>
            <div className="absolute top-2 right-2 bg-black/65 backdrop-blur-sm border border-white/10 rounded px-1.5 py-0.5 text-[8px] text-white/90">
              PPE · 142ms
            </div>
            <div className="absolute inset-2 pointer-events-none">
              <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/20 rounded-tl-sm" />
              <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/20 rounded-tr-sm" />
              <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/20 rounded-bl-sm" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/20 rounded-br-sm" />
            </div>
            <span className="absolute bottom-1.5 left-2 font-mono text-[8px] text-white/40">
              2026-05-24 14:32:08
            </span>
          </div>
          {!compact && (
            <div className="grid grid-cols-3 border-t border-[#e4e2db]">
              <StatCell label="Scans" value="847" />
              <StatCell label="Objects" value="3" />
              <StatCell label="Latency" value="142ms" />
            </div>
          )}
        </div>

        {/* Alerts panel */}
        {!compact && (
          <div className="bg-white rounded-[9px] border border-[#e4e2db] overflow-hidden flex flex-col shadow-sm min-h-0">
            <div className="px-2.5 py-1.5 border-b border-[#e4e2db]">
              <span className="text-[9px] font-semibold uppercase tracking-wide text-[#5f5e58]">
                Alerts
              </span>
            </div>
            <div className="flex-1 p-1.5 space-y-1 overflow-hidden">
              <AlertItem
                tone="resolved"
                icon="✓"
                title="PPE Check"
                desc="All workers compliant"
                time="14:31"
              />
              <AlertItem
                tone="critical"
                icon="⚠"
                title="Zone B Hazard"
                desc="Unsecured scaffolding detected"
                time="14:28"
              />
              <AlertItem
                tone="info"
                icon="↻"
                title="Progress Update"
                desc="Level 3 framing 67% complete"
                time="14:25"
              />
            </div>
            <div className="grid grid-cols-3 gap-1 p-1.5 border-t border-[#e4e2db]">
              <CountChip n={1} label="Critical" tone="red" />
              <CountChip n={2} label="Warning" tone="yellow" />
              <CountChip n={5} label="Resolved" tone="green" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1.5 border-r border-[#e4e2db] last:border-r-0">
      <p className="text-[8px] uppercase tracking-wide text-[#9e9b93] font-medium">
        {label}
      </p>
      <p className="font-mono text-xs font-medium text-[#18181a]">{value}</p>
    </div>
  );
}

function AlertItem({
  tone,
  icon,
  title,
  desc,
  time,
}: {
  tone: "critical" | "resolved" | "info";
  icon: string;
  title: string;
  desc: string;
  time: string;
}) {
  const styles = {
    critical: "bg-[#fef2f2] border-[#fecaca]",
    resolved: "bg-[#f0fdf4] border-[#86efac] opacity-80",
    info: "bg-[#eff6ff] border-[#bfdbfe]",
  };
  const titleColors = {
    critical: "text-[#dc2626]",
    resolved: "text-[#16a34a]",
    info: "text-[#2563eb]",
  };
  return (
    <div className={`rounded-lg border px-2 py-1.5 flex gap-1.5 ${styles[tone]}`}>
      <span className="text-xs shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`text-[10px] font-semibold ${titleColors[tone]}`}>{title}</p>
        <p className="text-[9px] text-[#5f5e58] truncate">{desc}</p>
        <p className="font-mono text-[8px] text-[#9e9b93] mt-0.5">{time}</p>
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
    <div className={`rounded-lg border text-center py-1 ${styles[tone]}`}>
      <span className="font-mono text-sm font-medium block leading-none">{n}</span>
      <span className="text-[8px] font-semibold uppercase tracking-wide">{label}</span>
    </div>
  );
}
