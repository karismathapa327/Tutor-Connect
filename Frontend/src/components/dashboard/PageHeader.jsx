function PageHeader({
  title,
  subtitle,
}) {
  return (
    <div className="mb-8">

      <h1 className="text-3xl font-bold text-slate-800">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 text-slate-500">
          {subtitle}
        </p>
      )}

    </div>
  );
}

export default PageHeader;