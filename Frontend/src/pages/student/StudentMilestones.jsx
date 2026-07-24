import { useEffect, useState } from "react";
import { Flame, BookOpen, Calendar, MessageSquare, CalendarCheck, ShieldCheck, Star } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import EmptyState from "../../components/dashboard/EmptyState";
import { CardSkeleton } from "../../components/common/Skeleton";
import { getMyMilestones, checkMilestones } from "../../api/featureApi";

const MILESTONE_DEFINITIONS = {
  first_session: {
    label: "First Session",
    description: "Completed your first tutoring session",
    icon: BookOpen,
    color: "indigo",
  },
  sessions_5: {
    label: "5 Sessions",
    description: "Completed 5 tutoring sessions",
    icon: Calendar,
    color: "blue",
  },
  sessions_10: {
    label: "10 Sessions",
    description: "Completed 10 tutoring sessions",
    icon: Calendar,
    color: "cyan",
  },
  sessions_25: {
    label: "25 Sessions",
    description: "Completed 25 tutoring sessions",
    icon: Calendar,
    color: "teal",
  },
  sessions_50: {
    label: "50 Sessions",
    description: "Completed 50 tutoring sessions",
    icon: Calendar,
    color: "emerald",
  },
  first_review: {
    label: "First Review",
    description: "Left your first tutor review",
    icon: MessageSquare,
    color: "purple",
  },
  reviews_5: {
    label: "5 Reviews",
    description: "Left 5 tutor reviews",
    icon: MessageSquare,
    color: "pink",
  },
  first_booking: {
    label: "First Booking",
    description: "Made your first session booking",
    icon: CalendarCheck,
    color: "orange",
  },
  streak_7: {
    label: "7-Day Streak",
    description: "Maintained a 7-day learning streak",
    icon: Flame,
    color: "amber",
  },
  streak_30: {
    label: "30-Day Streak",
    description: "Maintained a 30-day learning streak",
    icon: Flame,
    color: "red",
  },
  subjects_3: {
    label: "Subject Explorer",
    description: "Studied 3 different subjects",
    icon: BookOpen,
    color: "violet",
  },
  verified_session: {
    label: "Verified Session",
    description: "Completed a session with a verified tutor",
    icon: ShieldCheck,
    color: "emerald",
  },
};

function StudentMilestones() {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const data = await getMyMilestones();
      setMilestones(data.milestones || []);
    } catch (err) {
      console.error("Failed to load milestones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleCheckMilestones = async () => {
    try {
      setChecking(true);
      await checkMilestones();
      await fetchMilestones();
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const achievedCount = milestones.filter((m) => m.achieved).length;

  const colorClasses = {
    indigo: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300",
    blue: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
    cyan: "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300",
    teal: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300",
    emerald: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300",
    purple: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300",
    pink: "bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300",
    orange: "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300",
    amber: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300",
    red: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
    violet: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Flame className="text-amber-500" size={28} /> Milestones
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Track your learning journey achievements. {achievedCount} of {milestones.length} milestones unlocked.
          </p>
        </div>
        <button
          onClick={handleCheckMilestones}
          disabled={checking}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
        >
          {checking ? "Checking..." : "Refresh Milestones"}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : milestones.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="No Milestones Yet"
          description="Start tutoring to unlock your first milestone."
          buttonText="Find Tutors"
          buttonLink="/student/tutors"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {milestones.map((milestone) => {
            const def = MILESTONE_DEFINITIONS[milestone.type];
            const Icon = def?.icon || Star;
            const colorClass = colorClasses[def?.color] || colorClasses.indigo;

            return (
              <div
                key={milestone.type}
                className={`rounded-2xl p-6 border transition ${
                  milestone.achieved
                    ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border ${colorClass}`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{def?.label || milestone.type}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{def?.description}</p>
                    {milestone.achieved && milestone.achievedAt && (
                      <p className="text-[11px] text-slate-400 mt-2">
                        Achieved on {new Date(milestone.achievedAt).toLocaleDateString()}
                      </p>
                    )}
                    {!milestone.achieved && (
                      <span className="inline-block mt-2 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wide">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentMilestones;
