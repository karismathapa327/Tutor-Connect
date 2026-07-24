import { ShieldCheck, TrendingUp, Clock } from "lucide-react";

function MatchScoreBadge({ score, reliabilityScore, avgResponseTime, completedSessions, size = "md" }) {
  const scoreColor =
    score >= 80
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
      : score >= 60
        ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"
        : "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700";

  const textSize = size === "sm" ? "text-[10px]" : "text-xs";
  const valueSize = size === "sm" ? "text-sm" : "text-lg";

  return (
    <div className={`p-3 rounded-xl border ${scoreColor}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`${textSize} font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400`}>Recommendation Score</span>
        <span className={`${valueSize} font-bold`}>{score}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
        <div
          className="bg-indigo-500 dark:bg-indigo-400 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 text-[10px]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400">
            <ShieldCheck size={10} />
            <span>Reliability</span>
          </div>
          <p className="font-bold mt-0.5 text-emerald-600 dark:text-emerald-400">{reliabilityScore || 0}%</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400">
            <Clock size={10} />
            <span>Response</span>
          </div>
          <p className="font-bold mt-0.5 text-slate-700 dark:text-slate-300">{avgResponseTime > 0 ? `${avgResponseTime}m` : "N/A"}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400">
            <TrendingUp size={10} />
            <span>Sessions</span>
          </div>
          <p className="font-bold mt-0.5 text-slate-700 dark:text-slate-300">{completedSessions || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default MatchScoreBadge;
