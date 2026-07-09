import { Calendar, Clock, BookOpen, User } from "lucide-react";

function RequestCard({
  request,
  onAccept,
  onReject,
}) {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-xl font-semibold flex items-center gap-2">
            <User size={20} />
            {request.student.name}
          </h2>

          <p className="text-gray-500">
            {request.student.email}
          </p>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium
          ${
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

      <div className="mt-6 space-y-3">

        <div className="flex items-center gap-2">
          <BookOpen size={18} />
          <span>
            <strong>Subject:</strong> {request.subject}
          </span>
        </div>

        <div>
          <strong>Topic:</strong> {request.topic}
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={18} />
          <span>
            {new Date(request.preferredDate).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={18} />
          <span>{request.preferredTime}</span>
        </div>

      </div>

      {request.status === "Pending" && (

        <div className="flex gap-4 mt-6">

          <button
            onClick={() => onAccept(request._id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
          >
            Accept
          </button>

          <button
            onClick={() => onReject(request._id)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
          >
            Reject
          </button>

        </div>

      )}

    </div>
  );
}

export default RequestCard;