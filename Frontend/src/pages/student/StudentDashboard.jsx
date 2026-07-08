import {
  Calendar,
  CalendarPlus,
  MessageSquare,
  Search,
  Star,
} from "lucide-react";

import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../api/studentApi";

import StatCard from "../../components/dashboard/StatCard";
import PageHeader from "../../components/dashboard/PageHeader";
import QuickActions from "../../components/dashboard/QuickActions";
import SectionCard from "../../components/dashboard/SectionCard";
import EmptyState from "../../components/dashboard/EmptyState";
import {
  studentActions,
} from "../../mock/dashboard/studentData";

function StudentDashboard() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);
  
  const fetchDashboard = async () => {
    try {
    
      const data = await getStudentDashboard();
    
      setStats(data);
    
    } catch (error) {
    
      console.error(error);
    
    } finally {
    
      setLoading(false);
    
    }
  };
  
    return (
      <div>

      <PageHeader
        title="Dashboard"
        subtitle="Manage your sessions, tutor requests and learning progress."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        [
          {
            title: "Pending Requests",
            value: stats.pendingRequests,
            icon: MessageSquare,
            color: "yellow",
          },
          {
            title: "Upcoming Sessions",
            value: stats.upcomingSessions,
            icon: Calendar,
            color: "blue",
          },
          {
            title: "Completed Sessions",
            value: stats.completedSessions,
            icon: CalendarPlus,
            color: "green",
          },
          {
            title: "Reviews Given",
            value: stats.reviewsGiven,
            icon: Star,
            color: "purple",
          },
        ].map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))
      )}

      </div>

      <QuickActions actions={studentActions} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">

        <SectionCard
          title="Upcoming Sessions"
          subtitle="Your scheduled tutoring sessions."
        >
        
          <EmptyState
            icon={Calendar}
            title="No Upcoming Sessions"
            description="You haven't booked any tutoring sessions yet."
            buttonText="Find Tutors"
            buttonLink="/student/tutors"
          />

        </SectionCard>

        <SectionCard
          title="Recommended Tutors"
          subtitle="Tutors based on your interests."
        >
        
          <EmptyState
            icon={Search}
            title="No Tutor Recommendations"
            description="Browse tutors and start learning today."
            buttonText="Browse Tutors"
            buttonLink="/student/tutors"
          />

        </SectionCard>

      </div>
    </div>
  );
}

export default StudentDashboard;