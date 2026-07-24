import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Star, Briefcase, Wallet, Heart, Calendar, Clock, LineChart, ShieldCheck, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import PageHeader from "../../components/dashboard/PageHeader";
import EmptyState from "../../components/dashboard/EmptyState";
import { getTutorById, getAvailableSlots, createRequest } from "../../api/studentApi";
import SlotPicker from "../../components/tutor/SlotPicker";
import { formatNepaliDate } from "../../utils/dateUtils";

function TutorProfile() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [tutorUserId, setTutorUserId] = useState(null);

  useEffect(() => {
    fetchTutor();
  }, [id]);

  const fetchTutor = async () => {
    try {
      const data = await getTutorById(id);
      setTutor(data.tutor);
      setReviews(data.reviews || []);
      if (data.tutor?.user?._id) {
        setTutorUserId(data.tutor.user._id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showForm || !tutorUserId) return;
    const fetchSlots = async () => {
      try {
        setSlotsLoading(true);
        setSelectedSlot(null);
        const data = await getAvailableSlots(tutorUserId, selectedDate);
        setSlots(data.slots || []);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load slots.");
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [showForm, tutorUserId, selectedDate]);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast.error("Please select an available slot.");
      return;
    }

    try {
      setSubmitting(true);
      await createRequest({
        tutorId: tutor.user._id,
        subject: formData.subject,
        topic: formData.topic,
        slotId: selectedSlot._id,
      });
      toast.success("Session requested successfully! Waiting for tutor approval.");
      setFormData({ subject: "", topic: "" });
      setSelectedSlot(null);
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

        {tutor.matchReason && (
          <div className="mt-4 inline-flex items-start gap-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 rounded-xl px-4 py-3 text-xs text-indigo-800 dark:text-indigo-200">
            <LineChart size={14} className="shrink-0 mt-0.5" />
            <span>{tutor.matchReason}</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recommendation Score</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">{tutor.matchScore || 0}%</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Reliability</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{tutor.reliabilityScore || 0}%</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Quality</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">{tutor.qualityScore || 0}%</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sessions</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">{tutor.completedSessionsCount || 0}</p>
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

        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-8 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md shadow-indigo-600/20"
        >
          {showForm ? "Cancel Booking" : "Book a Session"}
        </button>

        {showForm && (
          <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Book a Session</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Select a date and an available time slot to request a session.</p>

            <div className="max-w-xs mb-6">
              <label className="block text-slate-600 dark:text-slate-400 font-medium mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <SlotPicker
              slots={slots}
              selectedSlot={selectedSlot}
              onSelectSlot={handleSelectSlot}
              loading={slotsLoading}
            />

            {selectedSlot && (
              <form onSubmit={handleSubmitRequest} className="space-y-5 max-w-3xl mt-6">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-2">Selected Slot</label>
                  <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 rounded-xl px-4 py-3 text-sm text-indigo-800 dark:text-indigo-200">
                    <Calendar size={16} />
                    <span>
                      {formatNepaliDate(new Date(selectedSlot.date), { format: "short" })} at {selectedSlot.startTime} - {selectedSlot.endTime}
                    </span>
                  </div>
                </div>

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
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Confirm Booking"}
                </button>
              </form>
            )}
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
                    <p className="text-xs text-slate-400">{formatNepaliDate(new Date(review.createdAt))}</p>
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
