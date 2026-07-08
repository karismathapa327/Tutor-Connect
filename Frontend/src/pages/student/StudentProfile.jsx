import { useEffect, useState } from "react";
import {
  Calendar,
  CalendarPlus,
  MessageSquare,
  Star,
} from "lucide-react";

import PageHeader from "../../components/dashboard/PageHeader";
import StatCard from "../../components/dashboard/StatCard";

import {
  getStudentProfile,
  getStudentDashboard,
} from "../../api/studentApi";

function StudentProfile() {

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8">

      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information."
      />

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow p-8">

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
              {new Date(profile.createdAt).toLocaleDateString()}
            </h3>

          </div>

        </div>

      </div>

      {/* Learning Summary */}
      <div>

        <h2 className="text-2xl font-semibold mb-6">
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