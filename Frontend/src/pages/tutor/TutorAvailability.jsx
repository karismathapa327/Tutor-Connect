import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Trash2, Clock, Calendar, X } from "lucide-react";
import { getMySlots, createSlot, deleteSlot, getTutorSlotStats } from "../../api/tutorApi";
import PageHeader from "../../components/dashboard/PageHeader";
import EmptyState from "../../components/dashboard/EmptyState";
import { formatNepaliDate } from "../../utils/dateUtils";

function TutorAvailability() {
  const [slots, setSlots] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [formData, setFormData] = useState({
    date: selectedDate,
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
      const [slotsData, statsData] = await Promise.all([
        getMySlots(),
        getTutorSlotStats(),
      ]);
      setSlots(slotsData.slots || []);
      setStats(statsData);
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
      const data = await createSlot(formData);
      setSlots((prev) => [...prev, data]);
      setShowModal(false);
      setFormData({ date: selectedDate, startTime: "", endTime: "" });
      toast.success("Availability slot added.");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add slot.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!confirm("Remove this slot? This action cannot be undone.")) return;
    try {
      await deleteSlot(slotId);
      setSlots((prev) => prev.filter((s) => s._id !== slotId));
      toast.success("Slot removed.");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove slot.");
    }
  };

  const grouped = slots.reduce((acc, slot) => {
    const dateKey = new Date(slot.date).toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(slot);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  const statusColors = {
    available: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    booked: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    blocked: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  };

  const statusLabels = {
    available: "Available",
    booked: "Booked",
    blocked: "Blocked",
  };

  if (loading) {
    return <h2 className="text-center mt-10 text-slate-500 font-medium">Loading...</h2>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="text-indigo-600 dark:text-indigo-400" size={28} /> Availability Schedule
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage your time slots. Students can only book from available slots.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center gap-2 shrink-0"
        >
          <Plus size={16} /> Add Slot
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Slots</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.totalSlots}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">Available</p>
            <p className="text-xl font-bold text-emerald-600">{stats.availableSlots}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">Booked</p>
            <p className="text-xl font-bold text-blue-600">{stats.bookedSlots}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">Utilization</p>
            <p className="text-xl font-bold text-indigo-600">{stats.utilizationRate}%</p>
          </div>
        </div>
      )}

      {slots.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Availability Slots"
          description="You haven't configured any time slots yet. Add slots so students can book sessions with you."
          buttonText="Add Availability"
          onButtonClick={() => setShowModal(true)}
        />
      ) : (
        <div className="space-y-6">
          {sortedDates.map((dateKey) => {
            const dateObj = new Date(dateKey + "T00:00:00");
            const daySlots = grouped[dateKey];

            return (
              <div key={dateKey} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {formatNepaliDate(dateObj, { format: "full" })}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {daySlots.length} slot{daySlots.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {daySlots.map((slot) => (
                    <div key={slot._id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <Clock size={14} className="text-indigo-500 shrink-0" />
                          <span className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColors[slot.status]}`}
                        >
                          {statusLabels[slot.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {slot.status === "available" && (
                          <button
                            onClick={() => handleDeleteSlot(slot._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            title="Remove slot"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
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
