import { useUI } from "../../context/UIContext";
import { NavLink, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";

import { sidebarMenus } from "../../data/sidebarMenus";
import useAuth from "../../hooks/useAuth";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { collapsed, toggleSidebar, isMobileOpen, setMobileOpen } = useUI();

  const menu = sidebarMenus[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 ${
          collapsed ? "w-20" : "w-64"
        } bg-white border-r border-slate-200 shadow-sm transition-all duration-300 flex flex-col ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
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

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-slate-100"
          >
            <X size={20} className="text-slate-600" />
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
                onClick={handleNavClick}
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
    </>
  );
}

export default Sidebar;