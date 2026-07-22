import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, CreditCard, Search } from "lucide-react";
import { getAllPayments } from "../../api/featureApi";
import EmptyState from "../../components/dashboard/EmptyState";
import { TableSkeleton } from "../../components/common/Skeleton";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getAllPayments();
      setPayments(data.payments || []);
      setTotalRevenue(data.totalRevenue || 0);
    } catch (err) {
      console.error("Failed to load payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.tutor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CreditCard className="text-indigo-600 dark:text-indigo-400" size={28} /> Payment Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Monitor all platform transactions and revenue analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-medium uppercase tracking-wide">
            <TrendingUp size={16} /> Total Revenue
          </div>
          <div className="text-3xl font-extrabold mt-2">${totalRevenue.toFixed(2)}</div>
          <p className="text-emerald-100 text-[11px] mt-1">Across {payments.length} transactions</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">
            <DollarSign size={16} className="text-indigo-500" /> Paid
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {payments.filter((p) => p.status === "Paid").length}
          </div>
          <p className="text-slate-400 text-[11px] mt-1">Successful transactions</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">
            <CreditCard size={16} className="text-amber-500" /> Pending
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {payments.filter((p) => p.status === "Pending").length}
          </div>
          <p className="text-slate-400 text-[11px] mt-1">Awaiting settlement</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student, tutor, or transaction ID..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : filteredPayments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Payments Found"
          description="No payment records match your search criteria."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Tutor</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-semibold text-slate-900 dark:text-slate-100">{p.transactionId}</td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{p.student?.name || "N/A"}</td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{p.tutor?.name || "N/A"}</td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-slate-100 text-sm">${p.amount.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase border ${
                          p.status === "Paid"
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200"
                            : p.status === "Pending"
                            ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 border-amber-200"
                            : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-200"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-400 font-mono">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPayments;
