import { Link } from "react-router-dom";

function QuickActions({ actions }) {
  return (
    <div className="mt-10">

      <h2 className="text-xl font-bold text-slate-800 mb-5">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {actions.map((action) => {

          const Icon = action.icon;

          return (

            <Link
              key={action.title}
              to={action.path}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >

              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">

                <Icon
                  size={28}
                  className="text-blue-600"
                />

              </div>

              <h3 className="font-semibold text-lg">

                {action.title}

              </h3>

              <p className="text-slate-500 mt-2 text-sm">

                {action.description}

              </p>

            </Link>

          );

        })}

      </div>

    </div>
  );
}

export default QuickActions;