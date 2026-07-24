import { useEffect, useState } from "react";
import { Calendar, MessageSquare, Star, Search, Heart, Award, TrendingUp, Clock, User, LineChart, BookOpen, Flame } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { getStudentDashboard, getSessions, getSuggestedTutors } from "../../api/studentApi";
import { getFavoriteIds, getMyMilestones } from "../../api/featureApi";
import StatCard from "../../components/dashboard/StatCard";
import PageHeader from "../../components/dashboard/PageHeader";
import QuickActions from "../../components/dashboard/QuickActions";
import SectionCard from "../../components/dashboard/SectionCard";
import EmptyState from "../../components/dashboard/EmptyState";
import { CardSkeleton } from "../../components/common/Skeleton";
import { studentActions } from "../../mock/dashboard/studentData";
import TutorCard from "../../components/tutor/TutorCard";
import { formatNepaliDate } from "../../utils/dateUtils";

const COLORS = ["#6366F1", "#10B981", "#EF4444", "#F59E0B"];

function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [upcomingSessionsList, setUpcomingSessionsList] = useState([]);
  const [suggestedTutors, setSuggestedTutors] = useState([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [milestoneCount, setMilestoneCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashboardData, sessionsData] = await Promise.all([
        getStudentDashboard(),
        getSessions({ status: "Upcoming" }).catch(() => ({ sessions: [] })),
      ]);
      setStats(dashboardData);
      setUpcomingSessionsList(sessionsData.sessions || []);
      setSuggestedTutors(dashboardData.recommendedTutors || []);

      const favData = await getFavoriteIds();
      setFavoriteCount(favData.favoriteIds?.length || 0);

      const milestoneData = await getMyMilestones();
      setMilestoneCount(milestoneData.milestones?.filter((m) => m.achieved).length || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: "Pending Requests", count: stats?.pendingRequests || 0 },
    { name: "Upcoming", count: stats?.upcomingSessions || 0 },
    { name: "Completed", count: stats?.completedSessions || 0 },
    { name: "Reviews Given", count: stats?.reviewsGiven || 0 },
  ];

  const pieData = [
    { name: "Upcoming", value: stats?.upcomingSessions || 0 },
    { name: "Completed", value: stats?.completedSessions || 0 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Dashboard"
        subtitle="Track your sessions, tutor requests, favorite tutors, and learning progress."
      />

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Pending Requests" value={stats?.pendingRequests || 0} icon={MessageSquare} color="yellow" />
          <StatCard title="Upcoming Sessions" value={stats?.upcomingSessions || 0} icon={Calendar} color="blue" />
          <StatCard title="Completed Sessions" value={stats?.completedSessions || 0} icon={TrendingUp} color="green" />
          <StatCard title="Saved Favorites" value={favoriteCount} icon={Heart} color="purple" />
          <StatCard title="Learning Hours" value={stats?.learningHours || 0} icon={Clock} color="emerald" />
          <StatCard title="Milestones" value={stats?.milestoneCount || milestoneCount} icon={Flame} color="amber" />
          <StatCard title="Learning Streak" value={`${stats?.learningStreak || 0} days`} icon={Flame} color="orange" />
          <StatCard title="Reviews Given" value={stats?.reviewsGiven || 0} icon={Star} color="pink" />
        </div>
      )}

      {/* Recharts Analytics Charts */}
      {stats && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" /> Learning Activity Overview
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-emerald-500" /> Session Distribution
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> Upcoming</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Completed</span>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Progress */}
      {stats?.weeklyProgress && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" /> Weekly Progress
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weeklyProgress}>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="sessions" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <QuickActions actions={studentActions} />

      {/* Suggested Tutors */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Suggested Tutors</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Tutors matched to your search filters and platform activity.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl h-64 w-full" />
            ))}
          </div>
        ) : suggestedTutors.length === 0 ? (
          <SectionCard title="No Suggestions Yet" subtitle="Adjust your filters to discover more tutors.">
            <EmptyState
              icon={Search}
              title="No Suggestions"
              description="Try broadening your filters to discover more tutors."
              buttonText="Find Tutors"
              buttonLink="/student/tutors"
            />
          </SectionCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {suggestedTutors.map((tutor) => (
              <TutorCard
                key={tutor._id}
                tutor={tutor}
                isFavorite={false}
                onToggleFavorite={undefined}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <SectionCard title="Upcoming Sessions" subtitle="Your upcoming scheduled tutoring sessions.">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl h-16 w-full" />
              ))}
            </div>
          ) : upcomingSessionsList.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No Upcoming Sessions"
              description="You haven't booked any tutoring sessions yet."
              buttonText="Find Tutors"
              buttonLink="/student/tutors"
            />
          ) : (
            <div className="space-y-3">
              {upcomingSessionsList.map((session) => (
                <div key={session._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      <User size={14} className="text-indigo-500" />
                      {session.tutor?.name || "Tutor"}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatNepaliDate(new Date(session.sessionDate))}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {session.sessionTime}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{session.subject}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200">
                    Waiting
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Milestones" subtitle="Achievements unlocked through your learning journey.">
          {(stats?.milestoneCount || milestoneCount) > 0 ? (
            <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-900/40 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="text-amber-500" size={32} />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Achievements Unlocked</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">You have earned {stats?.milestoneCount || milestoneCount} milestone(s).</p>
                </div>
              </div>
              <a href="/student/milestones" className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition">
                View All
              </a>
            </div>
          ) : (
            <EmptyState
              icon={Flame}
              title="No Milestones Yet"
              description="Complete sessions, leave reviews, and stay consistent to unlock milestones."
              buttonText="Find Tutors"
              buttonLink="/student/tutors"
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}

export default StudentDashboard;