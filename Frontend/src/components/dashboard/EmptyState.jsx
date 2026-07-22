import { Link } from "react-router-dom";

function EmptyState({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonLink,
  onButtonClick,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm my-4">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
          <Icon size={32} />
        </div>
      )}

      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
        {title}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-md leading-relaxed">
        {description}
      </p>

      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition shadow-md shadow-indigo-600/20"
        >
          {buttonText}
        </Link>
      )}

      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition shadow-md shadow-indigo-600/20"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;