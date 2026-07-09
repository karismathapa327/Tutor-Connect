import {
  Calendar,
  CalendarCheck,
  MessageSquare,
  Star,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getTutorDashboard,
} from "../../api/tutorApi";

import PageHeader from "../../components/dashboard/PageHeader";
import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import SectionCard from "../../components/dashboard/SectionCard";
import EmptyState from "../../components/dashboard/EmptyState";

import { tutorActions } from "../../mock/dashboard/tutorData";

function TutorDashboard() {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const data = await getTutorDashboard();

      setDashboard(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const stats = [
    {
      title: "Pending Requests",
      value: dashboard.pendingRequests,
      icon: MessageSquare,
      color: "yellow",
    },
    {
      title: "Upcoming Sessions",
      value: dashboard.upcomingSessionsList,
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Completed Sessions",
      value: dashboard.completedSessions,
      icon: CalendarCheck,
      color: "green",
    },
    {
      title: "Average Rating",
      value: dashboard.averageRating,
      icon: Star,
      color: "purple",
    },
  ];

  return (
    <div>

      <PageHeader
        title="Tutor Dashboard"
        subtitle="Manage tutoring requests and scheduled sessions."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))}

      </div>

      <QuickActions actions={tutorActions} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">

        <SectionCard
          title="Recent Requests"
          subtitle="Latest tutoring requests."
        >

          {dashboard.recentRequests.length === 0 ? (

            <EmptyState
              icon={MessageSquare}
              title="No Requests"
              description="New tutoring requests will appear here."
            />

          ) : (

            <div className="space-y-4">

              {dashboard.recentRequests.map((request) => (

                <div
                  key={request._id}
                  className="border rounded-lg p-4"
                >
                  <h3 className="font-semibold">
                    {request.student.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {request.subject}
                  </p>

                  <p className="text-sm">
                    {request.topic}
                  </p>

                </div>

              ))}

            </div>

          )}

        </SectionCard>

        <SectionCard
          title="Upcoming Sessions"
          subtitle="Your scheduled tutoring sessions."
        >

          {dashboard.upcomingSessionsList.length === 0 ? (

            <EmptyState
              icon={Calendar}
              title="No Sessions"
              description="Accepted requests will appear here."
            />

          ) : (

            <div className="space-y-4">

              {dashboard.upcomingSessionsList.map((session) => (

                <div
                  key={session._id}
                  className="border rounded-lg p-4"
                >
                  <h3 className="font-semibold">
                    {session.student.name}
                  </h3>

                  <p>{session.subject}</p>

                  <p className="text-sm text-gray-500">
                    {new Date(session.sessionDate).toLocaleDateString()}
                  </p>

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