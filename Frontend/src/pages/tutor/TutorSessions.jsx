import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getTutorSessions,
  completeSession,
} from "../../api/tutorApi";

function TutorSessions() {

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {

    try {

      const data = await getTutorSessions();

      setSessions(data.sessions);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const handleComplete = async (sessionId) => {

    try {

      const data = await completeSession(sessionId);

      toast.success(data.message);

      fetchSessions();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to update session."
      );

    }

  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Tutor Sessions
        </h1>

        <p className="text-gray-600">
          Manage your scheduled tutoring sessions.
        </p>

      </div>

      {sessions.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-8 text-center">

          <p className="text-gray-500">
            No sessions available.
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

            <p className="mt-2">
              <strong>Student:</strong>{" "}
              {session.student.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {session.student.email}
            </p>

            <p>
              <strong>Topic:</strong>{" "}
              {session.topic}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(session.sessionDate).toLocaleDateString()}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {session.sessionTime}
            </p>

            <div className="mt-4 flex items-center gap-4">

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  session.status === "Upcoming"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {session.status}
              </span>

              {session.status === "Upcoming" && (

                <button
                  onClick={() => handleComplete(session._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                >
                  Mark Completed
                </button>

              )}

            </div>

          </div>

        ))

      )}

    </div>

  );

}

export default TutorSessions;