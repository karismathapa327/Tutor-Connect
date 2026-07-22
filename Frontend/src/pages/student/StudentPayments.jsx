import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, DollarSign, Clock, ShieldCheck } from "lucide-react";
import { getMyPayments } from "../../api/featureApi";
import EmptyState from "../../components/dashboard/EmptyState";
import { TableSkeleton } from "../../components/common/Skeleton";

function StudentPayments() {
  const [payments, setPayments] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getMyPayments();
      setPayments(data.payments || []);
      setTotalSpent(data.totalAmount || 0);
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
          <CreditCard className="text-emerald-500" size={28} /> Payment & Billing History
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review your simulated tutoring session transactions and payment logs.
        </p>
      </div>

      {/* Metric Banner Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-medium uppercase tracking-wide">
            <DollarSign size={16} /> Total Paid
          </div>
          <div className="text-3xl font-extrabold mt-2">${totalSpent.toFixed(2)}</div>
          <p className="text-emerald-100 text-[11px] mt-1">Total across {payments.length} completed transactions</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">
            <CheckCircle2 size={16} className="text-emerald-500" /> Gateway Status
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2 flex items-center gap-1.5">
            Simulated Sandbox <ShieldCheck size={18} className="text-emerald-500" />
          </div>
          <p className="text-slate-400 text-[11px] mt-1">Safe mock transaction environment</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">
            <Clock size={16} className="text-indigo-500" /> Recent Activity
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {payments.length > 0 ? new Date(payments[0].createdAt).toLocaleDateString() : "No Activity"}
          </div>
          <p className="text-slate-400 text-[11px] mt-1">Last payment timestamp</p>
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Transaction History"
          description="You haven't made any session payments yet. When you book sessions, simulated transaction records will appear here."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 text-sm">
            Transaction Logs
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Tutor</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {p.transactionId}
                    </td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                      {p.tutor?.name || "Tutor"}
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {p.paymentMethod}
                    </td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] uppercase border border-emerald-200 dark:border-emerald-800/40">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-400 font-mono">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
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

export default StudentPayments;
