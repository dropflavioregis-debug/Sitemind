type SplitCompareProps = {
  leftTitle: string;
  rightTitle: string;
  leftItems: { label: string }[];
  rightItems: { label: string }[];
  message: string;
};

export default function SplitCompare({
  leftTitle,
  rightTitle,
  leftItems,
  rightItems,
  message,
}: SplitCompareProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <Panel title={leftTitle} variant="reality">
          {leftItems.map((item) => (
            <ItemRow key={item.label} label={item.label} tone="bad" />
          ))}
        </Panel>
        <Panel title={rightTitle} variant="perception">
          {rightItems.map((item) => (
            <ItemRow key={item.label} label={item.label} tone="good" />
          ))}
        </Panel>
      </div>
      <p className="text-center text-lg font-medium text-blue-700 mt-8">{message}</p>
    </div>
  );
}

function Panel({
  title,
  variant,
  children,
}: {
  title: string;
  variant: "reality" | "perception";
  children: React.ReactNode;
}) {
  const border =
    variant === "reality"
      ? "border-red-200 bg-red-50/50"
      : "border-emerald-200 bg-emerald-50/50";
  return (
    <div className={`rounded-xl border-2 ${border} p-5 md:p-6`}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">
        {title}
      </h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function ItemRow({ label, tone }: { label: string; tone: "bad" | "good" }) {
  const icon =
    tone === "bad" ? (
      <span className="text-red-500 font-bold">✕</span>
    ) : (
      <span className="text-emerald-500 font-bold">✓</span>
    );
  return (
    <li className="flex items-center gap-3 text-slate-800">
      {icon}
      <span>{label}</span>
    </li>
  );
}
