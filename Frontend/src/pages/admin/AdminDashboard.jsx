import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  UserCheck,
  FileText,
  Calendar,
  Star,
} from "lucide-react";

import { getDashboardStats } from "../../api/adminApi";
import { StatCard } from "../../components/dashboard"

function AdminDashboard() {
  const [stats, setStats] =useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    totalAdmins: 0,

    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    rejectedRequests: 0,

    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    cancelledSessions: 0,

    totalReviews: 0,
    averageRating: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 className="text-xl font-semibold">Loading Dashboard...</h2>;
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          color="green"
        />

        <StatCard
          title="Tutors"
          value={stats.totalTutors}
          icon={UserCheck}
          color="purple"
        />

        <StatCard
          title="Requests"
          value={stats.totalRequests}
          icon={FileText}
          color="orange"
        />

        <StatCard
          title="Sessions"
          value={stats.totalSessions}
          icon={Calendar}
          color="blue"
        />

        <StatCard
          title="Completed Sessions"
          value={stats.completedSessions}
          icon={Calendar}
          color="green"
        />

        <StatCard
          title="Reviews"
          value={stats.totalReviews}
          icon={Star}
          color="orange"
        />

        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          icon={Star}
          color="purple"
        />

      </div>
    </div>
  );
}

export default AdminDashboard;