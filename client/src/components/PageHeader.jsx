export default function PageHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3.5">
      {Icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
          <Icon className="h-6 w-6 text-white" strokeWidth={2.25} />
        </div>
      )}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50 sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-0.5 text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}
