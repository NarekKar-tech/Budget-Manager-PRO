import { WalletCards } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-glow">
        <WalletCards className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="font-semibold text-white">Budget Manager</p>
        <p className="text-xs uppercase tracking-[0.24em] text-violet-300">Pro</p>
      </div>
    </div>
  );
}
