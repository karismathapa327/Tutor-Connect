import { User, Star, BookOpen, Briefcase, Wallet, ShieldCheck, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function TutorCard({ tutor, isFavorite = false, onToggleFavorite }) {
  const navigate = useNavigate();
  const isVerified = tutor?.verificationStatus === "Approved";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900 transition duration-300 relative flex flex-col justify-between group">
      <div>
        {/* Header Avatar & Favorite Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                {tutor.user?.name ? tutor.user.name.charAt(0).toUpperCase() : "T"}
              </div>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 p-0.5 rounded-full" title="Verified Tutor">
                  <ShieldCheck size={18} className="text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {tutor.user?.name}
                </h3>
                {isVerified && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wide uppercase border border-emerald-200/60 dark:border-emerald-800/40">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {tutor.qualifications}
              </p>
            </div>
          </div>

          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(tutor.user._id);
              }}
              className={`p-2.5 rounded-xl border transition ${
                isFavorite
                  ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-500"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-rose-50"
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart size={18} className={isFavorite ? "fill-rose-500" : ""} />
            </button>
          )}
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 line-clamp-2 leading-relaxed">
          {tutor.bio}
        </p>

        {/* Subjects */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {tutor.subjects?.map((subject) => (
            <span
              key={subject}
              className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 text-xs px-2.5 py-1 rounded-lg font-medium border border-indigo-100/60 dark:border-indigo-900/40"
            >
              {subject}
            </span>
          ))}
        </div>

        {/* Details Metrics */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Briefcase size={15} className="text-indigo-500" />
            <span>{tutor.experience} Yrs Exp</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Wallet size={15} className="text-emerald-500" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">Rs. {tutor.hourlyRate}/hr</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 col-span-2">
            <Star size={15} className="text-amber-400 fill-amber-400" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {tutor.averageRating ? tutor.averageRating.toFixed(1) : "New"}
            </span>
            <span className="text-slate-400 font-normal">Rating</span>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => navigate(`/student/tutors/${tutor._id}`)}
        className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-indigo-600/20"
      >
        View Profile & Book
      </button>
    </div>
  );
}

export default TutorCard;