type DashboardMockupProps = {
  compact?: boolean;
};

export default function DashboardMockup({ compact = false }: DashboardMockupProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50 shadow-lg overflow-hidden ${
        compact ? "w-full" : "w-full max-w-lg"
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-slate-200">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-xs text-slate-500 font-medium">
          SiteMind Dashboard
        </span>
      </div>
      <div className={`grid ${compact ? "grid-cols-1" : "grid-cols-5"} gap-0`}>
        <div
          className={`${compact ? "h-32" : "col-span-3 h-48"} bg-slate-800 relative flex items-center justify-center`}
        >
          <svg
            className="w-12 h-12 text-slate-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </span>
          <div className="absolute bottom-2 left-2 right-2 flex gap-1">
            <span className="text-[9px] bg-emerald-600/90 text-white px-1.5 py-0.5 rounded">
              PPE OK
            </span>
            <span className="text-[9px] bg-red-600/90 text-white px-1.5 py-0.5 rounded">
              Hazard
            </span>
          </div>
        </div>
        {!compact && (
          <div className="col-span-2 p-3 space-y-2 bg-white">
            <AlertRow label="PPE Check" status="ok" />
            <AlertRow label="Zone B Hazard" status="warn" />
            <AlertRow label="Progress Update" status="info" />
          </div>
        )}
      </div>
    </div>
  );
}

function AlertRow({
  label,
  status,
}: {
  label: string;
  status: "ok" | "warn" | "info";
}) {
  const colors = {
    ok: "bg-emerald-100 text-emerald-700",
    warn: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-600">{label}</span>
      <span className={`px-2 py-0.5 rounded-full font-medium ${colors[status]}`}>
        {status === "ok" ? "Safe" : status === "warn" ? "Alert" : "Updated"}
      </span>
    </div>
  );
}
