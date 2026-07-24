import { formatNepaliDate } from "../../utils/dateUtils";
import { Calendar, Clock, BookOpen, User } from "lucide-react";

function RequestCard({
  request,
  onAccept,
  onReject,
}) {
  const displayDate = request.slotId
    ? formatNepaliDate(new Date(request.slotId.date))
    : request.preferredDate
    ? formatNepaliDate(new Date(request.preferredDate))
    : "N/A";

  const displayTime = request.slotId
    ? `${request.slotId.startTime} - ${request.slotId.endTime}`
    : request.preferredTime || "N/A";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <User size={20} className="text-indigo-500" />
            {request.student?.name || "Student"}
          </h2>

          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {request.student?.email}
          </p>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium
          ${
            request.status === "Pending"
              ? "bg-yellow-50 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400"
              : request.status === "Accepted"
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400"
          }`}
        >
          {request.status}
        </span>

      </div>

      <div className="mt-6 space-y-3">

        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-indigo-500" />
          <span className="text-slate-700 dark:text-slate-300">
            <strong>Subject:</strong> {request.subject}
          </span>
        </div>

        <div>
          <strong className="text-slate-700 dark:text-slate-300">Topic:</strong>{" "}
          <span className="text-slate-600 dark:text-slate-400">{request.topic}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-indigo-500" />
          <span className="text-slate-700 dark:text-slate-300">{displayDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={18} className="text-indigo-500" />
          <span className="text-slate-700 dark:text-slate-300">{displayTime}</span>
        </div>

      </div>

      {request.status === "Pending" && (

        <div className="flex gap-4 mt-6">

          <button
            onClick={() => onAccept(request._id)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition"
          >
            Accept
          </button>

          <button
            onClick={() => onReject(request._id)}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg font-medium transition"
          >
            Reject
          </button>

        </div>

      )}

    </div>
  );
}

export default RequestCard;
