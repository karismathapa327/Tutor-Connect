import { useEffect, useState } from "react";
import {
  getSessions,
  createReview,
} from "../../api/studentApi";

function StudentSessions() {

  const [sessions, setSessions] = useState([]);

  const [selectedSession, setSelectedSession] = useState(null);

  const [reviewData, setReviewData] = useState({
    rating: 5,
    review: "",
  });

  const handleChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReviewSubmit = async () => {
    try {

      await createReview({
        sessionId: selectedSession,
        rating: Number(reviewData.rating),
        review: reviewData.review,
      });

      alert("Review submitted successfully.");

      setSelectedSession(null);

      setReviewData({
        rating: 5,
        review: "",
      });

      fetchSessions();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to submit review."
      );

    }
  };

  const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {

      const data = await getSessions();

      setSessions(data.sessions);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          My Sessions
        </h1>

        <p className="text-gray-600">
          View your upcoming and completed tutoring sessions.
        </p>

      </div>

      {sessions.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-8 text-center">

          <p className="text-gray-500">
            You have no tutoring sessions yet.
          </p>

        </div>

      ) : (

        sessions.map((session) => (

          <div
            key={session._id}
            className="bg-white rounded-xl shadow p-6"
          >

            <h2 className="text-xl font-semibold">
              {session.subject}
            </h2>

            <p className="text-gray-600 mt-2">
              <strong>Tutor:</strong> {session.tutor.name}
            </p>

            <p className="text-gray-600">
              <strong>Topic:</strong> {session.topic}
            </p>

            <p className="text-gray-600">
              <strong>Date:</strong>{" "}
              {new Date(session.sessionDate).toLocaleDateString()}
            </p>

            <p className="text-gray-600">
              <strong>Time:</strong> {session.sessionTime}
            </p>

            <div className="mt-4">

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  session.status === "Upcoming"
                    ? "bg-blue-100 text-blue-700"
                    : session.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {session.status}
              </span>

              {session.status === "Completed" && (
                 <button
                    onClick={() => setSelectedSession(session._id)}
                    className="mt-4 bg-green-600 text-white px-4 py-2 mx-5 rounded-lg"
                  >
                    Leave Review
                  </button>
                )}

            </div>

          </div>

        ))

      )}
    
    {selectedSession && (
    
      <div className="bg-white rounded-xl shadow p-6">
      
        <h2 className="text-xl font-bold mb-4">
          Leave Review
        </h2>
    
        <select
          name="rating"
          value={reviewData.rating}
          onChange={handleChange}
          className="w-full border rounded-lg p-3 mb-4"
        >
          <option value={5}>5 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={2}>2 Stars</option>
          <option value={1}>1 Star</option>
        </select>
    
        <textarea
          name="review"
          rows="4"
          value={reviewData.review}
          onChange={handleChange}
          placeholder="Write your review..."
          className="w-full border rounded-lg p-3"
        />
    
        <button
          onClick={handleReviewSubmit}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Submit Review
        </button>
    
      </div>
    
    )}

    </div>
  );
}



export default StudentSessions;