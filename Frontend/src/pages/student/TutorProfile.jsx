import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTutorById } from "../../api/studentApi";

function TutorProfile() {

  const { id } = useParams();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutor();
  }, []);

  const fetchTutor = async () => {

    try {

      const data = await getTutorById(id);

      setTutor(data.tutor);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!tutor) {
    return <h2>Tutor not found.</h2>;
  }

    return (
      <div className="max-w-5xl mx-auto space-y-8">
    
        <div className="bg-white rounded-2xl shadow p-8">
    
          <div className="flex items-center gap-6">
    
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600">
              {tutor.user.name.charAt(0)}
            </div>
    
            <div>
              <h1 className="text-3xl font-bold">
                {tutor.user.name}
              </h1>
    
              <p className="text-gray-500 mt-1">
                {tutor.qualifications}
              </p>
    
              <p className="text-blue-600 mt-2">
                ⭐ {tutor.averageRating.toFixed(1)}
              </p>
            </div>
    
          </div>
    
          <div className="mt-8">
    
            <h2 className="font-semibold text-lg">
              About
            </h2>
    
            <p className="text-gray-600 mt-2">
              {tutor.bio}
            </p>
    
          </div>
    
          <div className="mt-8">
    
            <h2 className="font-semibold text-lg">
              Subjects
            </h2>
    
            <div className="flex flex-wrap gap-2 mt-3">
    
              {tutor.subjects.map((subject) => (
                <span
                  key={subject}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                >
                  {subject}
                </span>
              ))}
    
            </div>
          
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
          
            <div className="bg-gray-50 rounded-xl p-5">
          
              <h3 className="font-semibold">
                Experience
              </h3>
          
              <p className="mt-2">
                {tutor.experience} Years
              </p>
          
            </div>
          
            <div className="bg-gray-50 rounded-xl p-5">
          
              <h3 className="font-semibold">
                Hourly Rate
              </h3>
          
              <p className="mt-2">
                Rs. {tutor.hourlyRate} / hour
              </p>
          
            </div>
          
          </div>
          
          <button
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
          >
            Request Session
          </button>
          
        </div>
          
      </div>
    );
}

export default TutorProfile;