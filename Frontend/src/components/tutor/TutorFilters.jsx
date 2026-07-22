import { Filter, RotateCcw } from "lucide-react";

function TutorFilters({ filters, setFilters, subjects = [], onReset }) {
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 text-sm">
          <Filter size={16} className="text-indigo-600 dark:text-indigo-400" />
          Filter Tutors
        </div>
        <button
          onClick={onReset}
          className="text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition"
        >
          <RotateCcw size={13} /> Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Subject
          </label>
          <select
            value={filters.subject || ""}
            onChange={(e) => handleChange("subject", e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Minimum Rating
          </label>
          <select
            value={filters.minRating || ""}
            onChange={(e) => handleChange("minRating", e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5 ⭐ & above</option>
            <option value="4.0">4.0 ⭐ & above</option>
            <option value="3.0">3.0 ⭐ & above</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Experience
          </label>
          <select
            value={filters.experience || ""}
            onChange={(e) => handleChange("experience", e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Any Experience</option>
            <option value="1">1+ Year</option>
            <option value="3">3+ Years</option>
            <option value="5">5+ Years</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Max Price (Rs./hr)
          </label>
          <select
            value={filters.maxPrice || ""}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Any Price</option>
            <option value="500">Under Rs. 500/hr</option>
            <option value="1000">Under Rs. 1000/hr</option>
            <option value="1200">Under Rs. 1200/hr</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
            Availability Day
          </label>
          <select
            value={filters.day || ""}
            onChange={(e) => handleChange("day", e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Any Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default TutorFilters;
