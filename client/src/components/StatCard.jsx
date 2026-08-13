function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h2>

        </div>

        <div className="rounded-xl bg-blue-600/10 p-3 text-blue-400">
          <Icon size={24} />
        </div>

      </div>

    </div>
  )
}

export default StatCard