import {
  Calendar,
  CalendarPlus,
  MessageSquare,
  Search,
  Star,
} from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";
import PageHeader from "../../components/dashboard/PageHeader";
import QuickActions from "../../components/dashboard/QuickActions";
import SectionCard from "../../components/dashboard/SectionCard";
import EmptyState from "../../components/dashboard/EmptyState";
import {
  studentStats,
  studentActions,
} from "../../mock/dashboard/studentData";

function StudentDashboard() {

  return (
    <div>

      <PageHeader
        title="Dashboard"
        subtitle="Manage your sessions, tutor requests and learning progress."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {studentStats.map((stat) => (
        
          <StatCard
            key={stat.title}
            {...stat}
          />
        
        ))}

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