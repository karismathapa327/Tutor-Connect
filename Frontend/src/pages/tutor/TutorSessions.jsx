import { useEffect, useState } from "react";
import { Calendar, CheckCircle2, XCircle, Clock, Star } from "lucide-react";
import { getTutorSessions, completeSession, cancelSession } from "../../api/tutorApi";
import { toast } from "react-toastify";
import PageHeader from "../../components/dashboard/PageHeader";
import EmptyState from "../../components/dashboard/EmptyState";
import { TableSkeleton } from "../../components/common/Skeleton";
import { formatNepaliDate } from "../../utils/dateUtils";

function TutorSessions() {
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, [activeTab]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params = activeTab !== "All" ? { status: activeTab } : {};
      const data = await getTutorSessions(params);
      setSessions(data.sessions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (sessionId) => {
    try {
      const data = await completeSession(sessionId);
      toast.success(data.message);
      fetchSessions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update session.");
    }
  };

  const handleCancel = async (sessionId) => {
    if (!confirm("Are you sure you want to cancel this session?")) return;
    try {
      const data = await cancelSession(sessionId);
      toast.success(data.message);
      fetchSessions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel session.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Upcoming":
        return (
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200">
            Upcoming
          </span>
        );
      case "Completed":
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200">
            Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tutoring Sessions"
        subtitle="Manage your scheduled, completed, and cancelled sessions."
      />

      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-sm font-semibold">
        {["All", "Upcoming", "Completed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 transition relative ${
              activeTab === tab
                ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            {tab} Sessions
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab} Sessions Found`}
          description="You don't have any sessions in this category yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    {session.subject}
                  </span>
                  {getStatusBadge(session.status)}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {session.topic}
                </h3>

                <div className="mt-3 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200">Student:</strong> {session.student?.name || "Student"}
                  </p>
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200">Date:</strong> {formatNepaliDate(new Date(session.sessionDate))}
                  </p>
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200">Time Slot:</strong> {session.sessionTime}
                  </p>
                  {session.slotId && (
                    <p className="text-[10px] text-slate-400">
                      Slot ID: {session.slotId._id?.toString().slice(-6)}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 justify-end">
                {session.status === "Upcoming" && (
                  <>
                    <button
                      onClick={() => handleComplete(session._id)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} /> Mark Completed
                    </button>
                    <button
                      onClick={() => handleCancel(session._id)}
                      className="px-3.5 py-2 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TutorSessions;
