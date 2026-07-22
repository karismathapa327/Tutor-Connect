import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTutorById, createRequest } from "../../api/studentApi";
import { toast } from "react-toastify";
import { Star, BookOpen, Briefcase, Wallet, Heart, Calendar, Clock } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import EmptyState from "../../components/dashboard/EmptyState";

function TutorProfile() {
  const { id } = useParams();
  const today = new Date().toISOString().split("T")[0];
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTutor();
  }, [id]);

  const fetchTutor = async () => {
    try {
      const data = await getTutorById(id);
      setTutor(data.tutor);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createRequest({
        tutorId: tutor.user._id,
        subject: formData.subject,
        topic: formData.topic,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
      });
      toast.success("Tutoring request sent successfully!");
      setFormData({ subject: "", topic: "", preferredDate: "", preferredTime: "" });
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10 text-slate-500 font-medium">Loading...</h2>;
  }

  if (!tutor) {
    return <h2 className="text-center mt-10 text-slate-500">Tutor not found.</h2>;
  }

  const isVerified = tutor.verificationStatus === "Approved";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
            {tutor.user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{tutor.user.name}</h1>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800/40">
                  Verified
                </span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{tutor.qualifications}</p>
            <div className="flex items-center gap-1 mt-2">
              <Star size={18} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {tutor.averageRating ? tutor.averageRating.toFixed(1) : "New"}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">Rating</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">About</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{tutor.bio}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Subjects</h2>
          <div className="flex flex-wrap gap-2">
            {tutor.subjects?.map((subject) => (
              <span key={subject} className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-lg text-sm font-medium border border-indigo-100 dark:border-indigo-900/40">
                {subject}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-500" /> Experience
            </h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">{tutor.experience} Years</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Wallet size={18} className="text-emerald-500" /> Hourly Rate
            </h3>
            <p className="mt-2 text-slate-700 dark:text-slate-300">Rs. {tutor.hourlyRate} / hour</p>
          </div>
        </div>

        {tutor.availability && tutor.availability.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Availability</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tutor.availability.map((slot) => (
                <div key={slot._id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                  <span className="font-medium text-slate-900 dark:text-slate-100 text-sm">{slot.day}</span>
                  <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                    <Clock size={14} />
                    <span>
                      {slot.startTime} - {slot.endTime}
                    </span>
                    {slot.isBooked && <span className="ml-2 text-rose-500 text-[10px] font-semibold uppercase">Booked</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md shadow-indigo-600/20"
        >
          {showForm ? "Cancel Request" : "Request Session"}
        </button>

        {showForm && (
          <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Request a Tutoring Session</h2>
            <form onSubmit={handleSubmitRequest} className="space-y-5 max-w-3xl">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-2">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Subject</option>
                  {tutor.subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-2">Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
                  placeholder="Enter topic"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-2">Preferred Date</label>
                  <input
                    type="date"
                    min={today}
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-2">Preferred Time</label>
                  <input
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Request"}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Student Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{review.student?.name}</h3>
                    <p className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">{review.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorProfile;
