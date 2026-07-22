import { useEffect, useState } from "react";
import { Calendar, MessageSquare, Star, Search, Heart, Award, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { getStudentDashboard } from "../../api/studentApi";
import { getFavoriteIds, getMyCertificates } from "../../api/featureApi";
import StatCard from "../../components/dashboard/StatCard";
import PageHeader from "../../components/dashboard/PageHeader";
import QuickActions from "../../components/dashboard/QuickActions";
import SectionCard from "../../components/dashboard/SectionCard";
import EmptyState from "../../components/dashboard/EmptyState";
import { CardSkeleton } from "../../components/common/Skeleton";
import { studentActions } from "../../mock/dashboard/studentData";

const COLORS = ["#6366F1", "#10B981", "#EF4444", "#F59E0B"];

function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [certCount, setCertCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getStudentDashboard();
      setStats(data);

      const favData = await getFavoriteIds();
      setFavoriteCount(favData.favoriteIds?.length || 0);

      const certData = await getMyCertificates();
      setCertCount(certData.certificates?.length || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: "Pending Requests", count: stats?.pendingRequests || 0 },
    { name: "Upcoming", count: stats?.upcomingSessions || 0 },
    { name: "Completed", count: stats?.completedSessions || 0 },
    { name: "Reviews Given", count: stats?.reviewsGiven || 0 },
  ];

  const pieData = [
    { name: "Upcoming", value: stats?.upcomingSessions || 0 },
    { name: "Completed", value: stats?.completedSessions || 0 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Dashboard"
        subtitle="Track your sessions, tutor requests, favorite tutors, and learning progress."
      />

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Pending Requests" value={stats?.pendingRequests || 0} icon={MessageSquare} color="yellow" />
          <StatCard title="Upcoming Sessions" value={stats?.upcomingSessions || 0} icon={Calendar} color="blue" />
          <StatCard title="Completed Sessions" value={stats?.completedSessions || 0} icon={TrendingUp} color="green" />
          <StatCard title="Saved Favorites" value={favoriteCount} icon={Heart} color="purple" />
        </div>
      )}

      {/* Recharts Analytics Charts */}
      {stats && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" /> Learning Activity Overview
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-emerald-500" /> Session Distribution
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> Upcoming</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Completed</span>
            </div>
          </div>
        </div>
      )}

      <QuickActions actions={studentActions} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <SectionCard title="Upcoming Sessions" subtitle="Your upcoming scheduled tutoring sessions.">
          <EmptyState
            icon={Calendar}
            title="No Upcoming Sessions"
            description="You haven't booked any tutoring sessions yet."
            buttonText="Find Tutors"
            buttonLink="/student/tutors"
          />
        </SectionCard>

        <SectionCard title="Certificates Earned" subtitle="Milestone certificates issued to you.">
          {certCount > 0 ? (
            <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-900/40 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="text-amber-500" size={32} />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Official Milestone Certificates</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">You have earned {certCount} downloadable certificate(s).</p>
                </div>
              </div>
              <a href="/student/certificates" className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition">
                View All
              </a>
            </div>
          ) : (
            <EmptyState
              icon={Award}
              title="No Certificates Yet"
              description="Complete tutoring sessions with tutors to earn downloadable PDF certificates."
              buttonText="View Sessions"
              buttonLink="/student/sessions"
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}

export default StudentDashboard;