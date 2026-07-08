import { useUI } from "../../context/UIContext";
import { NavLink, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";

import { sidebarMenus } from "../../data/sidebarMenus";
import useAuth from "../../hooks/useAuth";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { collapsed, toggleSidebar } = useUI();

  const menu = sidebarMenus[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r border-slate-200 shadow-sm transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}

      <div className="p-5 border-b border-slate-200">

        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 w-full"
        >
          <GraduationCap
            size={32}
            className="text-blue-600"
          />

          {!collapsed && (
            <span className="text-xl font-bold text-blue-600">
              TutorConnect
            </span>
          )}
        </button>

      </div>

      {/* Menu */}

      <nav className="flex-1 p-3">

        {menu.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.title : ""}
              className={({ isActive }) =>
                `relative flex items-center gap-4 px-4 py-3 mb-2 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              <Icon size={20} />

              {!collapsed && (
                <span className="font-medium">
                  {item.title}
                </span>
              )}
            </NavLink>

          );

        })}

      </nav>

      {/* Logout */}

      <div className="p-3 border-t border-slate-200">

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full"
        >
          <LogOut size={20} />

          {!collapsed && (
            <span className="font-medium">
              Logout
            </span>
          )}

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;