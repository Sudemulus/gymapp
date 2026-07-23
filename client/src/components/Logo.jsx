import { Dumbbell } from "lucide-react";

export default function Logo({ className = "h-9 w-9" }) {
  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/40 ring-1 ring-white/10`}
    >
      <Dumbbell className="h-[58%] w-[58%] text-white" strokeWidth={2.5} />
    </div>
  );
}
