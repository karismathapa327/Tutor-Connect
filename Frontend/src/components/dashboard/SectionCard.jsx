function SectionCard({
  title,
  subtitle,
  children,
  action,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-xl font-semibold text-slate-800">
            {title}
          </h2>

          {subtitle && (
            <p className="text-slate-500 mt-1">
              {subtitle}
            </p>
          )}

        </div>

        {action}

      </div>

      {/* Content */}

      {children}

    </div>
  );
}

export default SectionCard;