import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  UserCheck,
  FileText,
  Calendar,
  Star,
  DollarSign,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

import { getDashboardStats } from "../../api/adminApi";
import { StatCard, PageHeader, SectionCard, EmptyState } from "../../components/dashboard";
import { CardSkeleton } from "../../components/common/Skeleton";

const COLORS = ["#6366F1", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Admin Dashboard" subtitle="Platform overview and analytics." />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!stats && !loading) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 dark:text-red-400 mb-4">{error || "Failed to load dashboard data."}</p>
        <button onClick={fetchDashboard} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  const monthlyData = [
    { name: "Jan", users: 120, sessions: 45 },
    { name: "Feb", users: 180, sessions: 60 },
    { name: "Mar", users: 250, sessions: 90 },
    { name: "Apr", users: 320, sessions: 120 },
    { name: "May", users: 400, sessions: 150 },
    { name: "Jun", users: 480, sessions: 180 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform overview, analytics, and key performance metrics."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers || 0} icon={Users} color="blue" />
        <StatCard title="Students" value={stats.totalStudents || 0} icon={GraduationCap} color="green" />
        <StatCard title="Tutors" value={stats.totalTutors || 0} icon={UserCheck} color="purple" />
        <StatCard title="Admins" value={stats.totalAdmins || 0} icon={ShieldCheck} color="red" />
        <StatCard title="Total Requests" value={stats.totalRequests || 0} icon={FileText} color="orange" />
        <StatCard title="Total Sessions" value={stats.totalSessions || 0} icon={Calendar} color="blue" />
        <StatCard title="Completed Sessions" value={stats.completedSessions || 0} icon={Calendar} color="green" />
        <StatCard title="Average Rating" value={stats.averageRating ? Number(stats.averageRating).toFixed(1) : "N/A"} icon={Star} color="purple" />
        <StatCard title="Total Revenue" value={`$${(stats.totalRevenue || 0).toFixed(2)}`} icon={DollarSign} color="emerald" />
        <StatCard title="Verified Tutors" value={stats.verifiedTutorsCount || 0} icon={UserCheck} color="green" />
        <StatCard title="Pending Verifications" value={stats.pendingVerificationsCount || 0} icon={ShieldCheck} color="amber" />
        <StatCard title="Total Reviews" value={stats.totalReviews || 0} icon={Star} color="orange" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Sessions by Subject" subtitle="Most requested tutoring subjects.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartSubjectData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="sessions" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Session Status Distribution" subtitle="Overview of session lifecycle.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartStatusData || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {(stats.chartStatusData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="User Role Distribution" subtitle="Breakdown of platform users by role.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartUserRoleData || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {(stats.chartUserRoleData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Platform Growth Trend" subtitle="Monthly user and session growth.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                <Line type="monotone" dataKey="users" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default AdminDashboard;
