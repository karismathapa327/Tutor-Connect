import { User, Star, BookOpen, Briefcase, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

function TutorCard({ tutor }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition duration-300">

      {/* Avatar & Name */}
      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">

          <User className="text-blue-600" size={28} />

        </div>

        <div>

          <h2 className="text-xl font-semibold">
            {tutor.user.name}
          </h2>

          <p className="text-gray-500 text-sm">
            {tutor.qualifications}
          </p>

        </div>

      </div>

      {/* Bio */}
      <p className="text-gray-600 mt-5">
        {tutor.bio}
      </p>

      {/* Subjects */}
      <div className="flex flex-wrap gap-2 mt-5">

        {tutor.subjects.map((subject) => (
          <span
            key={subject}
            className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full"
          >
            {subject}
          </span>
        ))}

      </div>

      {/* Information */}
      <div className="mt-6 space-y-3 text-sm">

        <div className="flex items-center gap-2">

          <BookOpen size={18} className="text-blue-600" />

          <span>
            Subjects: {tutor.subjects.length}
          </span>

        </div>

        <div className="flex items-center gap-2">

          <Briefcase size={18} className="text-blue-600" />

          <span>
            {tutor.experience} Years Experience
          </span>

        </div>

        <div className="flex items-center gap-2">

          <Wallet size={18} className="text-blue-600" />

          <span>
            Rs. {tutor.hourlyRate} / hour
          </span>

        </div>

        <div className="flex items-center gap-2">

          <Star size={18} className="text-yellow-500 fill-yellow-400" />

          <span>
            {tutor.averageRating.toFixed(1)}
          </span>

        </div>

      </div>

      {/* Button */}
        <button
          onClick={() => navigate(`/student/tutors/${tutor._id}`)}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
        >
          View Profile
        </button>

    </div>
  );
}

export default TutorCard;