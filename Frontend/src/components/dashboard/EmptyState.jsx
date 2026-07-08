import { Link } from "react-router-dom";

function EmptyState({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonLink,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">

      {Icon && (
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-5">

          <Icon
            size={36}
            className="text-blue-600"
          />

        </div>
      )}

      <h3 className="text-xl font-semibold text-slate-800">
        {title}
      </h3>

      <p className="text-slate-500 mt-3 max-w-sm">
        {description}
      </p>

      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          {buttonText}
        </Link>
      )}

    </div>
  );
}

export default EmptyState;