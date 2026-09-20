
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="glass min-w-0 rounded-2xl p-4 shadow-glow sm:rounded-3xl sm:p-5">

      <div className="flex min-w-0 items-center justify-between gap-3">

        <p className="min-w-0 text-xs text-slate-400 sm:text-sm">
          {label}
        </p>

        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-300 sm:h-10 sm:w-10 sm:rounded-2xl">
          <Icon className="h-5 w-5" />
        </div>

      </div>

      <p className="mt-4 break-words text-2xl font-semibold tabular-nums sm:mt-5 sm:text-3xl">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {detail}
      </p>

    </div>
  );
}