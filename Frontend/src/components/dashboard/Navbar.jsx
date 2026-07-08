import { Bell } from "lucide-react";
import UserDropdown from "./UserDropdown";
import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  };

  return (
    <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between">

      {/* Left */}

      <div>

        <h1 className="text-2xl font-bold text-slate-800">
          {getGreeting()}, {user?.name} 👋
        </h1>

        <p className="text-slate-500 capitalize mt-1">
          {user?.role} Dashboard
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition">

          <Bell
            size={22}
            className="text-slate-600"
          />

          {/* Notification Badge */}

          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">

            3

          </span>

        </button>

        <UserDropdown />

      </div>

    </header>
  );
}

export default Navbar;