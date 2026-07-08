import { useEffect, useState } from "react";
import { getRequests } from "../../api/studentApi";

function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getRequests();
      setRequests(data.requests);
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
          My Requests
        </h1>

        <p className="text-gray-600">
          Track your tutoring requests.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-gray-500">
            You haven't sent any tutoring requests yet.
          </p>
        </div>
      ) : (
        requests.map((request) => (
          <div
            key={request._id}
            className="bg-white rounded-xl shadow p-6"
          >
            <h2 className="text-xl font-semibold">
              {request.subject}
            </h2>

            <p className="text-gray-600 mt-2">
              <strong>Tutor:</strong> {request.tutor.name}
            </p>

            <p className="text-gray-600">
              <strong>Topic:</strong> {request.topic}
            </p>

            <p className="text-gray-600">
              <strong>Date:</strong>{" "}
              {new Date(request.preferredDate).toLocaleDateString()}
            </p>

            <p className="text-gray-600">
              <strong>Time:</strong> {request.preferredTime}
            </p>

            <div className="mt-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  request.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : request.status === "Accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {request.status}
              </span>
            </div>
          </div>
        ))
      )}

    </div>
  );
}

export default StudentRequests;