import { useEffect, useState } from "react";
import { getSessions } from "../../api/adminApi";
import PageHeader from "../../components/dashboard/PageHeader";
import ReusableTable from "../../components/common/ReusableTable";
import { CalendarDays, Search } from "lucide-react";
import { downloadCSV } from "../../utils/exportCSV";
import { formatNepaliDate } from "../../utils/dateUtils";

function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 10;

  useEffect(() => {
    fetchSessions();
  }, [page, search]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getSessions({ search, page, limit: LIMIT });
      setSessions(data.sessions || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Upcoming":
        return <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 text-xs font-semibold border border-blue-200">Upcoming</span>;
      case "Completed":
        return <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 text-xs font-semibold border border-emerald-200">Completed</span>;
      case "Cancelled":
        return <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 text-xs font-semibold border border-rose-200">Cancelled</span>;
      default:
        return status;
    }
  };

  const columns = [
    { key: "student.name", label: "Student", render: (val) => val || "—" },
    { key: "tutor.name", label: "Tutor", render: (val) => val || "—" },
    { key: "subject", label: "Subject" },
    { key: "topic", label: "Topic" },
    {
      key: "sessionDate",
      label: "Date",
      render: (val) => (val ? formatNepaliDate(new Date(val)) : "—"),
    },
    { key: "sessionTime", label: "Time" },
    {
      key: "status",
      label: "Status",
      render: (status) => getStatusBadge(status),
    },
  ];

  const handleExport = () => {
    downloadCSV(sessions, "sessions", columns);
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="All Sessions" subtitle="Monitor all platform tutoring sessions." />
        <ReusableTable columns={columns} data={[]} loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-rose-600">Something went wrong</h2>
        <p className="mt-3 text-slate-600">{error}</p>
        <button onClick={fetchSessions} className="mt-5 bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="All Sessions" subtitle={`Total Sessions: ${sessions.length > 0 ? "showing paginated results" : "0"}`} />

      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search sessions..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={handleExport} className="ml-4 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          Export CSV
        </button>
      </div>

      <ReusableTable
        columns={columns}
        data={sessions}
        loading={loading}
        emptyIcon={CalendarDays}
        emptyTitle="No Sessions Found"
        emptyDescription="Try another search keyword."
        showPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default AdminSessions;
