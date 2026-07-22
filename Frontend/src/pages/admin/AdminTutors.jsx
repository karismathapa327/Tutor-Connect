import { useEffect, useState } from "react";
import { Search, Loader2, GraduationCap } from "lucide-react";
import { getTutors } from "../../api/adminApi";
import PageHeader from "../../components/dashboard/PageHeader";
import ReusableTable from "../../components/common/ReusableTable";
import { downloadCSV } from "../../utils/exportCSV";

function AdminTutors() {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 10;

  useEffect(() => {
    fetchTutors();
  }, [page, search]);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getTutors({ search, page, limit: LIMIT });
      setTutors(data.tutors || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load tutor profiles.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "user.name", label: "Name", render: (val) => val || "N/A" },
    {
      key: "subjects",
      label: "Subjects",
      render: (subjects) => subjects?.join(", ") || "—",
    },
    { key: "qualifications", label: "Qualification" },
    { key: "experience", label: "Experience", render: (val) => `${val} yrs` },
    { key: "hourlyRate", label: "Hourly Rate", render: (val) => `Rs. ${val}` },
    {
      key: "averageRating",
      label: "Rating",
      render: (val) => (val ? Number(val).toFixed(1) : "New"),
    },
  ];

  const handleExport = () => {
    downloadCSV(tutors, "tutors", columns);
  };

  if (loading && tutors.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Tutor Profiles" subtitle="Manage and review all registered tutors." />
        <ReusableTable columns={columns} data={[]} loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-rose-600">Something went wrong</h2>
        <p className="mt-3 text-slate-600">{error}</p>
        <button onClick={fetchTutors} className="mt-5 bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Tutor Profiles" subtitle={`Total Tutors: ${tutors.length > 0 ? "showing paginated results" : "0"}`} />

      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search tutors..."
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
        data={tutors}
        loading={loading}
        emptyIcon={GraduationCap}
        emptyTitle="No Tutors Found"
        emptyDescription="We couldn't find any tutors matching your search."
        showPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default AdminTutors;
