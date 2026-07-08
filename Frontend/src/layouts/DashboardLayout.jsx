import { Outlet } from "react-router-dom";
import { Sidebar, Navbar } from "../components/dashboard";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Content */}

      <div className="flex flex-col flex-1">

        {/* Top Navbar */}

        <Navbar />

        {/* Page Content */}

        <main className="flex-1 overflow-y-auto p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;