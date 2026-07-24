import { formatNepaliDate } from "../../utils/dateUtils";
import { Calendar, Clock } from "lucide-react";

function SlotPicker({ slots, selectedSlot, onSelectSlot, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <p className="text-slate-500 dark:text-slate-400 text-sm py-4 text-center">
        No available slots found. Check back later or contact the tutor for more availability.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {slots.map((slot) => {
        const isSelected = selectedSlot?._id === slot._id;
        const slotDate = formatNepaliDate(new Date(slot.date), { format: "short" });

        return (
          <button
            key={slot._id}
            type="button"
            onClick={() => onSelectSlot(slot)}
            className={`flex items-center justify-between p-3 rounded-xl border-2 transition text-left ${
              isSelected
                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 shadow-md"
                : "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/30 hover:border-emerald-400 dark:hover:border-emerald-700"
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <Calendar size={14} className="text-slate-500" />
                {slotDate}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mt-1">
                <Clock size={12} />
                {slot.startTime} - {slot.endTime}
              </div>
            </div>
            {isSelected && (
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                Selected
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default SlotPicker;
