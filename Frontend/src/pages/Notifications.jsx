import { useEffect, useState } from "react";
import { Bell, CheckCheck, CircleAlert, Calendar, Star, DollarSign, ShieldCheck, Loader2 } from "lucide-react";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../api/featureApi";
import { toast } from "react-toastify";
import PageHeader from "../components/dashboard/PageHeader";
import EmptyState from "../components/dashboard/EmptyState";
import { TableSkeleton } from "../components/common/Skeleton";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read.");
    } catch (err) {
      toast.error("Failed to mark all as read.");
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "request":
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case "review":
        return <Star className="w-4 h-4 text-amber-500" />;
      case "payment":
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case "verification":
        return <ShieldCheck className="w-4 h-4 text-purple-500" />;
      default:
        return <CircleAlert className="w-4 h-4 text-indigo-500" />;
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="text-indigo-600 dark:text-indigo-400" size={28} /> Notifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.` : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            {markingAll ? <Loader2 size={16} className="animate-spin" /> : <CheckCheck size={16} />}
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You don't have any notifications yet. They will appear here when you receive updates."
        />
      ) : (
        <div className="space-y-6">
          {unreadNotifications.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Unread</h2>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {unreadNotifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => handleMarkAsRead(n._id)}
                    className="p-4 flex gap-4 items-start transition cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-indigo-50/30 dark:bg-indigo-950/10"
                  >
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 shrink-0 mt-0.5">
                      {getNotifIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {readNotifications.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Earlier</h2>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {readNotifications.map((n) => (
                  <div
                    key={n._id}
                    className="p-4 flex gap-4 items-start transition opacity-75 hover:opacity-100"
                  >
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                      {getNotifIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
