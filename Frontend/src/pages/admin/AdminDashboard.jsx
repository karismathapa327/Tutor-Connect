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
  Clock,
  BarChart3,
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
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

import { formatNepaliDate, NEPALI_MONTHS_EN } from "../../utils/dateUtils";
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
    { name: NEPALI_MONTHS_EN[0], users: 120, sessions: 45 },
    { name: NEPALI_MONTHS_EN[1], users: 180, sessions: 60 },
    { name: NEPALI_MONTHS_EN[2], users: 250, sessions: 90 },
    { name: NEPALI_MONTHS_EN[3], users: 320, sessions: 120 },
    { name: NEPALI_MONTHS_EN[4], users: 400, sessions: 150 },
    { name: NEPALI_MONTHS_EN[5], users: 480, sessions: 180 },
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
        <StatCard title="Total Revenue" value={`Rs. ${(stats.totalRevenue || 0).toFixed(2)}`} icon={DollarSign} color="emerald" />
        <StatCard title="Verified Tutors" value={stats.verifiedTutorsCount || 0} icon={UserCheck} color="green" />
        <StatCard title="Pending Verifications" value={stats.pendingVerificationsCount || 0} icon={ShieldCheck} color="amber" />
        <StatCard title="Total Reviews" value={stats.totalReviews || 0} icon={Star} color="orange" />
        {stats.totalSlots > 0 && (
          <>
            <StatCard title="Available Slots" value={stats.availableSlots || 0} icon={Clock} color="emerald" />
            <StatCard title="Booked Slots" value={stats.bookedSlots || 0} icon={Calendar} color="blue" />
            <StatCard title="Utilization Rate" value={`${stats.slotUtilizationRate || 0}%`} icon={BarChart3} color="purple" />
          </>
        )}
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

        {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 && (
          <SectionCard title="Monthly Revenue" subtitle="Platform earnings over time.">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        )}

        {stats.monthlySessions && stats.monthlySessions.length > 0 && (
          <SectionCard title="Monthly Sessions" subtitle="Session volume over time.">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlySessions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Area type="monotone" dataKey="sessions" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        )}

        {stats.tutorPerformance && stats.tutorPerformance.length > 0 && (
          <SectionCard title="Tutor Performance" subtitle="Top tutors by completed sessions.">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.tutorPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={120} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="sessions" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        )}

        {stats.cancellationTrend && stats.cancellationTrend.length > 0 && (
          <SectionCard title="Cancellation Trend" subtitle="Session cancellations over time.">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.cancellationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Line type="monotone" dataKey="cancellations" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        )}

        {stats.peakBookingHours && stats.peakBookingHours.length > 0 && (
          <SectionCard title="Peak Booking Hours" subtitle="Most popular booking times.">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.peakBookingHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="bookings" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
