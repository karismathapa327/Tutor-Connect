import TutorCard from "./TutorCard";
import { CardSkeleton } from "../common/Skeleton";

function TutorGrid({ tutors, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tutors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400 text-sm">No tutors found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {tutors.map((tutor) => (
        <TutorCard
          key={tutor._id}
          tutor={tutor}
        />
      ))}
    </div>
  );
}

export default TutorGrid;