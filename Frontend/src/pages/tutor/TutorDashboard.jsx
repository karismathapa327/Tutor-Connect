import { useEffect, useState } from "react";
import { Calendar, CalendarCheck, MessageSquare, Star, TrendingUp, ShieldCheck, Clock, BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { getTutorDashboard, getTutorSlotStats } from "../../api/tutorApi";
import PageHeader from "../../components/dashboard/PageHeader";
import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import SectionCard from "../../components/dashboard/SectionCard";
import EmptyState from "../../components/dashboard/EmptyState";
import { CardSkeleton } from "../../components/common/Skeleton";
import { tutorActions } from "../../mock/dashboard/tutorData";
import { formatNepaliDate } from "../../utils/dateUtils";

function TutorDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [slotStats, setSlotStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashData, slotsData] = await Promise.all([
        getTutorDashboard(),
        getTutorSlotStats().catch(() => ({})),
      ]);
      setDashboard(dashData);
      setSlotStats(slotsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: "Pending", count: dashboard?.pendingRequests || 0 },
    { name: "Upcoming", count: dashboard?.upcomingSessions || 0 },
    { name: "Completed", count: dashboard?.completedSessions || 0 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tutor Dashboard"
        subtitle="Track student requests, manage time slots, view ratings, and conduct sessions."
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          <StatCard title="Pending Requests" value={dashboard?.pendingRequests || 0} icon={MessageSquare} color="yellow" />
          <StatCard title="Upcoming Sessions" value={dashboard?.upcomingSessions || 0} icon={Calendar} color="blue" />
          <StatCard title="Completed Sessions" value={dashboard?.completedSessions || 0} icon={CalendarCheck} color="green" />
          <StatCard title="Average Rating" value={dashboard?.averageRating ? dashboard.averageRating.toFixed(1) : "N/A"} icon={Star} color="purple" />
          <StatCard title="Reliability Score" value={`${dashboard?.reliabilityScore || 0}%`} icon={ShieldCheck} color="emerald" />
          <StatCard title="Quality Score" value={`${dashboard?.qualityScore || 0}%`} icon={TrendingUp} color="blue" />
          <StatCard title="Acceptance Rate" value={`${dashboard?.acceptanceRate || 0}%`} icon={MessageSquare} color="green" />
          <StatCard title="Monthly Earnings" value={`Rs. ${(dashboard?.monthlyEarnings || 0).toFixed(2)}`} icon={TrendingUp} color="amber" />
          <StatCard title="Response Time" value={`${dashboard?.avgResponseTimeMinutes || 0}m`} icon={Clock} color="orange" />
        </div>
      )}

      {/* Analytics Recharts Graph */}
      {dashboard && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" /> Session Performance Metrics
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: "12px" }} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <QuickActions actions={tutorActions} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Recent Student Requests" subtitle="Latest tutoring session requests from students.">
          {!dashboard?.recentRequests || dashboard.recentRequests.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No Incoming Requests" description="New tutoring requests will appear here." />
          ) : (
            <div className="space-y-3">
              {dashboard.recentRequests.map((request) => (
                <div key={request._id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{request.student?.name}</h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{request.subject} - {request.topic}</p>
                  </div>
                  <a href="/tutor/requests" className="px-3 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded-lg hover:bg-indigo-700 transition">
                    Review
                  </a>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Upcoming Scheduled Sessions" subtitle="Your accepted tutoring sessions.">
          {!dashboard?.upcomingSessionsList || dashboard.upcomingSessionsList.length === 0 ? (
            <EmptyState icon={Calendar} title="No Upcoming Sessions" description="Accepted requests will appear here." />
          ) : (
            <div className="space-y-3">
              {dashboard.upcomingSessionsList.map((session) => (
                <div key={session._id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{session.student?.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{session.subject} • {formatNepaliDate(new Date(session.sessionDate))}</p>
                  </div>
                  <a href="/tutor/sessions" className="px-3 py-1.5 bg-emerald-600 text-white font-semibold text-xs rounded-lg hover:bg-emerald-700 transition">
                    Manage
                  </a>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

export default TutorDashboard;