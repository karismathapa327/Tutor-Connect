import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function UserDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      {/* Avatar */}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 hover:bg-slate-100 px-3 py-2 rounded-xl transition"
      >
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">

          {user?.name?.charAt(0).toUpperCase()}

        </div>

        <div className="hidden md:block text-left">

          <p className="font-semibold">

            {user?.name}

          </p>

          <p className="text-sm text-slate-500 capitalize">

            {user?.role}

          </p>

        </div>

        <ChevronDown
          size={18}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />

      </button>

      {/* Dropdown */}

      {open && (

        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden z-50">

      <button
        onClick={() => navigate(`/${user?.role}/profile`)}
        className="flex items-center gap-3 w-full px-5 py-3 hover:bg-slate-50 transition"
      >
        <User size={18} />
        Profile
      </button>

      <button
        onClick={() => navigate(`/${user?.role}/settings`)}
        className="flex items-center gap-3 w-full px-5 py-3 hover:bg-slate-50 transition"
      >
        <Settings size={18} />
        Settings
      </button>

          <hr />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-5 py-3 text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />

            Logout
          </button>

        </div>

      )}

    </div>
  );
}

export default UserDropdown;