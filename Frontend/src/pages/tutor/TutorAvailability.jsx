import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Trash2, Clock, Calendar, X } from "lucide-react";
import { addAvailabilitySlot, deleteAvailabilitySlot, getTutorProfile } from "../../api/tutorApi";
import PageHeader from "../../components/dashboard/PageHeader";
import EmptyState from "../../components/dashboard/EmptyState";

function TutorAvailability() {
  const [availability, setAvailability] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    day: "Monday",
    date: "",
    startTime: "",
    endTime: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTutorProfile();
      setProfile(data);
      setAvailability(data.availability || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = await addAvailabilitySlot(formData);
      setAvailability(data.availability || []);
      setShowModal(false);
      setFormData({ day: "Monday", date: "", startTime: "", endTime: "" });
      toast.success("Availability slot added.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add slot.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!confirm("Remove this availability slot?")) return;
    try {
      const data = await deleteAvailabilitySlot(slotId);
      setAvailability(data.availability || []);
      toast.success("Slot removed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove slot.");
    }
  };

  const grouped = availability.reduce((acc, slot) => {
    if (!acc[slot.day]) acc[slot.day] = [];
    acc[slot.day].push(slot);
    return acc;
  }, {});

  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return <h2 className="text-center mt-10 text-slate-500 font-medium">Loading...</h2>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="text-indigo-600 dark:text-indigo-400" size={28} /> Availability Calendar
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage your available time slots for student bookings.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center gap-2 shrink-0"
        >
          <Plus size={16} /> Add Slot
        </button>
      </div>

      {availability.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Availability Slots"
          description="You haven't configured any time slots yet. Add slots so students can book sessions with you."
          buttonText="Add Availability"
          onButtonClick={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {daysOrder
            .filter((day) => grouped[day] && grouped[day].length > 0)
            .map((day) => (
              <div key={day} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{day}</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {grouped[day].map((slot) => (
                    <div key={slot._id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <Clock size={14} className="text-indigo-500 shrink-0" />
                        <span className="font-medium">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        {slot.isBooked && (
                          <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-600 text-[10px] font-bold uppercase border border-rose-200">
                            Booked
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteSlot(slot._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Remove slot"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add Availability Slot</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSlot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Day</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {daysOrder.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={today}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Add Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TutorAvailability;
