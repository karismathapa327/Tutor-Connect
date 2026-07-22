import { Outlet } from "react-router-dom";
import { Sidebar, Navbar } from "../components/dashboard";
import { useUI } from "../context/UIContext";
import { Menu } from "lucide-react";

function DashboardLayout() {
  const { openMobile, isMobileOpen } = useUI();

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Mobile hamburger */}
      <button
        onClick={openMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">

        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto p-6 lg:p-8 ${isMobileOpen ? "blur-sm lg:blur-none" : ""}`}>
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;