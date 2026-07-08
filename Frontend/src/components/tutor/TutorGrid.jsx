import TutorCard from "./TutorCard";

function TutorGrid({ tutors, loading }) {

  if (loading) {
    return (
      <p className="text-center">
        Loading tutors...
      </p>
    );
  }

  if (tutors.length === 0) {
    return (
      <p className="text-center">
        No tutors found.
      </p>
    );
  }

  return (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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