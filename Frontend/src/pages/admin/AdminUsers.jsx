import { useEffect, useState } from "react";
import { Search, Trash2, Loader2, Users } from "lucide-react";
import { getUsers, deleteUser } from "../../api/adminApi";
import { toast } from "react-toastify";
import PageHeader from "../../components/dashboard/PageHeader";
import ReusableTable from "../../components/common/ReusableTable";
import Pagination from "../../components/common/Pagination";
import { downloadCSV } from "../../utils/exportCSV";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 10;

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getUsers({ search, page, limit: LIMIT });
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Delete "${name}"?\n\nThis action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-semibold">Admin</span>;
      case "tutor":
        return <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">Tutor</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">Student</span>;
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (role) => getRoleBadge(role),
    },
  ];

  const actions = (row) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDelete(row._id, row.name);
      }}
      disabled={deletingId === row._id}
      className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
    >
      {deletingId === row._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
      Delete
    </button>
  );

  const handleExport = () => {
    downloadCSV(users, "users", columns);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Users Management" subtitle="Manage all registered users on the platform." />

      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email or role..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={handleExport} className="ml-4 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
          Export CSV
        </button>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-rose-600">Something went wrong</h2>
          <p className="mt-2 text-slate-600">{error}</p>
          <button onClick={fetchUsers} className="mt-5 bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700">
            Try Again
          </button>
        </div>
      ) : (
        <>
          <ReusableTable
            columns={columns}
            data={users}
            loading={loading}
            emptyIcon={Users}
            emptyTitle="No Users Found"
            emptyDescription="Try another search keyword."
            actions={actions}
            showPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default AdminUsers;
