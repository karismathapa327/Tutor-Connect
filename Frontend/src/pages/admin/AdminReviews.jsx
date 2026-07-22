import { useEffect, useState } from "react";
import { Star, MessageSquare, Search } from "lucide-react";
import { getReviews } from "../../api/adminApi";
import PageHeader from "../../components/dashboard/PageHeader";
import ReusableTable from "../../components/common/ReusableTable";
import { downloadCSV } from "../../utils/exportCSV";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 10;

  useEffect(() => {
    fetchReviews();
  }, [page, search]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getReviews({ search, page, limit: LIMIT });
      setReviews(data.reviews || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={16} className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
        ))}
      </div>
    );
  };

  const columns = [
    { key: "student.name", label: "Student", render: (val) => val || "—" },
    { key: "tutor.name", label: "Tutor", render: (val) => val || "—" },
    {
      key: "rating",
      label: "Rating",
      render: (rating) => renderStars(rating),
    },
    { key: "review", label: "Review" },
    {
      key: "createdAt",
      label: "Date",
      render: (val) => (val ? new Date(val).toLocaleDateString() : "—"),
    },
  ];

  const handleExport = () => {
    downloadCSV(reviews, "reviews", columns);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="All Reviews" subtitle="Monitor all platform reviews and ratings." />
        <ReusableTable columns={columns} data={[]} loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-rose-600">Something went wrong</h2>
        <p className="mt-3 text-slate-600">{error}</p>
        <button onClick={fetchReviews} className="mt-5 bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="All Reviews" subtitle={`Total Reviews: ${reviews.length > 0 ? "showing paginated results" : "0"}`} />

      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search reviews..."
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
        data={reviews}
        loading={loading}
        emptyIcon={MessageSquare}
        emptyTitle="No Reviews Found"
        emptyDescription="Try another search keyword."
        showPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default AdminReviews;
