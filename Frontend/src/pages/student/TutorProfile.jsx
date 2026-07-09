import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTutorById, createRequest } from "../../api/studentApi";
import { toast } from "react-toastify";

function TutorProfile() {

  const { id } = useParams();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    preferredDate: "",
    preferredTime: "",
  });


  useEffect(() => {
    fetchTutor();
  }, []);

  const fetchTutor = async () => {

    try {

      const data = await getTutorById(id);

      setTutor(data.tutor);
      setReviews(data.reviews);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    try {
    
      await createRequest({
        tutorId: tutor.user._id,
        subject: formData.subject,
        topic: formData.topic,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
      });
    
      toast.success("Tutoring request sent successfully!");
    
      setFormData({
        subject: "",
        topic: "",
        preferredDate: "",
        preferredTime: "",
      });
    
      setShowForm(false);
    
    } catch (error) {
    
      toast.error(
        error.response?.data?.message ||
        "Failed to send request."
      );
    
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
            onClick={() => setShowForm(!showForm)}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
          >
            {showForm ? "Cancel" : "Request Session"}
          </button>

          {showForm && (
            <div className="mt-8 border-t pt-8">
            
              <h2 className="text-2xl font-bold mb-6">
                Request a Tutoring Session
              </h2>
          
              <form
                onSubmit={handleSubmitRequest}
                className="space-y-5"
              >
          
                <div>
                  <label className="block font-medium mb-2">
                    Subject
                  </label>
          
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subject: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-3"
                  >
                    <option value="">Select Subject</option>
                  
                    {tutor.subjects.map((subject) => (
                      <option
                        key={subject}
                        value={subject}
                      >
                        {subject}
                      </option>
                    ))}
          
                  </select>
                </div>
                  
                <div>
                  <label className="block font-medium mb-2">
                    Topic
                  </label>
                  
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        topic: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-3"
                    placeholder="Enter topic"
                  />
                </div>
                  
                <div>
                  <label className="block font-medium mb-2">
                    Preferred Date
                  </label>
                  
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredDate: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>
                  
                <div>
                  <label className="block font-medium mb-2">
                    Preferred Time
                  </label>
                  
                  <input
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredTime: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-3"
                  />
                </div>
                  
                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
                >
                    Send Request
                </button>
                  
              </form>
                  
            </div>
          )}
          
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6">
            Student Reviews
          </h2>

          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="border-b py-4"
              >
                <h3 className="font-semibold">
                  {review.student.name}
                </h3>
            
                <p>
                  ⭐ {review.rating}
                </p>
            
                <p className="text-gray-600 mt-2">
                  {review.review}
                </p>
              </div>
            ))
          )}
        </div>
          
      </div>
    );
}


export default TutorProfile;