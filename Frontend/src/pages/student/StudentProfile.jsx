import { useEffect, useState } from "react";
import {
  Calendar,
  CalendarPlus,
  MessageSquare,
  Star,
  CheckCircle2,
} from "lucide-react";

import PageHeader from "../../components/dashboard/PageHeader";
import StatCard from "../../components/dashboard/StatCard";

import {
  getStudentProfile,
  getStudentDashboard,
} from "../../api/studentApi";
import { formatNepaliDate } from "../../utils/dateUtils";

function StudentProfile() {

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    try {

      const [profileData, dashboardData] = await Promise.all([
        getStudentProfile(),
        getStudentDashboard(),
      ]);

      setProfile(profileData);
      setStats(dashboardData);

    } catch (error) {

      console.error(error);
      setError("Failed to load profile. Please try again later.");

    } finally {

      setLoading(false);

    }

  };

  const summaryStats = [
    {
      title: "Pending Requests",
      value: stats?.pendingRequests || 0,
      icon: MessageSquare,
      color: "yellow",
    },
    {
      title: "Upcoming Sessions",
      value: stats?.upcomingSessions || 0,
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Completed Sessions",
      value: stats?.completedSessions || 0,
      icon: CalendarPlus,
      color: "green",
    },
    {
      title: "Reviews Given",
      value: stats?.reviewsGiven || 0,
      icon: Star,
      color: "purple",
    },
  ];

  if (loading) {
    return (
      <h2 className="text-center text-xl font-semibold mt-10">
        Loading...
      </h2>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchProfile}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-10">
        <p className="text-slate-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information."
      />

      {/* Personal Information */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8">

        <div className="flex items-center gap-6 mb-8">

          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">

            {profile.name.charAt(0).toUpperCase()}

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              {profile.name}
            </h2>

            <p className="text-gray-500 capitalize">
              {profile.role}
            </p>

          </div>

        </div>

        <h2 className="text-xl font-semibold mb-6">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>

            <p className="text-gray-500">
              Name
            </p>

            <h3 className="font-semibold text-lg">
              {profile.name}
            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Email
            </p>

            <h3 className="font-semibold text-lg">
              {profile.email}
            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Role
            </p>

            <h3 className="font-semibold text-lg capitalize">
              {profile.role}
            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Member Since
            </p>

            <h3 className="font-semibold text-lg">
              {formatNepaliDate(new Date(profile.createdAt))}
            </h3>

          </div>

        </div>

      </div>

      {/* Profile Completion */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Profile Strength</h3>
          </div>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">100%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
          <div className="bg-emerald-600 dark:bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: "100%" }} />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Your profile is complete. Keep learning to unlock more features.
        </p>
      </div>

      {/* Learning Summary */}
      <div>

        <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-slate-100">
          Learning Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {summaryStats.map((stat) => (

            <StatCard
              key={stat.title}
              {...stat}
            />

          ))}

        </div>

      </div>

    </div>
  );
}

export default StudentProfile;