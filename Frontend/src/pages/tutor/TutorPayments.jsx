import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Wallet, Clock } from "lucide-react";
import { getMyPayments } from "../../api/featureApi";
import EmptyState from "../../components/dashboard/EmptyState";
import { TableSkeleton } from "../../components/common/Skeleton";
import { formatNepaliDate } from "../../utils/dateUtils";

function TutorPayments() {
  const [payments, setPayments] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getMyPayments();
      setPayments(data.payments || []);
      setTotalEarnings(data.totalAmount || 0);
    } catch (err) {
      console.error("Failed to load payments:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Wallet className="text-indigo-600 dark:text-indigo-400" size={28} /> Earnings & Payments
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Track your tutoring session earnings and transaction history.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
          <div className="flex items-center gap-2 text-indigo-100 text-xs font-medium uppercase tracking-wide">
            <TrendingUp size={16} /> Total Earnings
          </div>
          <div className="text-3xl font-extrabold mt-2">Rs. {totalEarnings.toFixed(2)}</div>
          <p className="text-indigo-100 text-[11px] mt-1">Across {payments.length} completed transactions</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">
            <DollarSign size={16} className="text-emerald-500" /> Payment Status
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2">Simulated</div>
          <p className="text-slate-400 text-[11px] mt-1">Sandbox transaction environment</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">
            <Clock size={16} className="text-amber-500" /> Pending
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {payments.filter((p) => p.status === "Pending").length}
          </div>
          <p className="text-slate-400 text-[11px] mt-1">Awaiting confirmation</p>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No Payments Yet"
          description="Earnings from completed sessions will appear here."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 text-sm">
            Transaction History
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-semibold text-slate-900 dark:text-slate-100">{p.transactionId}</td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{p.student?.name || "Student"}</td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">{p.paymentMethod}</td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-slate-100 text-sm">Rs. {p.amount.toFixed(2)}</td>
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
                    <td className="p-4 text-right text-slate-400 font-mono">{formatNepaliDate(new Date(p.createdAt))}</td>
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

export default TutorPayments;
