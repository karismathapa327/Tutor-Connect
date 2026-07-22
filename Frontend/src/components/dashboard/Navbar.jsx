import { useState, useEffect, useRef } from "react";
import { Bell, Sun, Moon, CheckCheck, CircleAlert, Calendar, Star, DollarSign, ShieldCheck } from "lucide-react";
import UserDropdown from "./UserDropdown";
import useAuth from "../../hooks/useAuth";
import { useUI } from "../../context/UIContext";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../../api/featureApi";

function Navbar() {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useUI();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);

  const fetchNotifs = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 20000); // Poll every 20s
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
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

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-20 px-8 flex items-center justify-between transition-colors">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {getGreeting()}, {user?.name} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 capitalize mt-0.5 text-sm">
          {user?.role} Portal
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setShowPopover((prev) => !prev)}
            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Popover Dropdown */}
          {showPopover && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden transition">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                      className={`p-4 flex gap-3 items-start transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                        !n.isRead ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                        {getNotifIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <UserDropdown />
      </div>
    </header>
  );
}

export default Navbar;