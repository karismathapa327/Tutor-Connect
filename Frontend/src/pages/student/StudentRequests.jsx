import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { getRequests } from "../../api/studentApi";
import PageHeader from "../../components/dashboard/PageHeader";
import EmptyState from "../../components/dashboard/EmptyState";
import { TableSkeleton } from "../../components/common/Skeleton";
import { formatNepaliDate } from "../../utils/dateUtils";

function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getRequests();
      setRequests(data.requests || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-200">
            Pending
          </span>
        );
      case "Accepted":
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200">
            Accepted
          </span>
        );
      case "Rejected":
        return (
          <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200">
            Rejected
          </span>
        );
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tutoring Requests"
        subtitle="Track the status of your session requests sent to tutors."
      />

      {loading ? (
        <TableSkeleton rows={5} />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No Requests Sent"
          description="You haven't sent any tutoring requests yet. Browse tutors and request a session to get started."
          buttonText="Find Tutors"
          buttonLink="/student/tutors"
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Tutor</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Topic</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{request.tutor?.name || "Tutor"}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{request.subject}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{request.topic}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">
                      {formatNepaliDate(new Date(request.preferredDate))}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{request.preferredTime}</td>
                    <td className="p-4 text-center">{getStatusBadge(request.status)}</td>
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

export default StudentRequests;
