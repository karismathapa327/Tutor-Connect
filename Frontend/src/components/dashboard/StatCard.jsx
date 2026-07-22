function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

          {subtitle && (
            <p className="text-sm text-slate-400 mt-2">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors[color]}`}
        >
          {Icon && <Icon size={28} />}
        </div>

      </div>

    </div>
  );
}

export default StatCard;