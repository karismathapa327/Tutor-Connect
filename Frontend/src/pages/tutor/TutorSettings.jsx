import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/dashboard/PageHeader";
import { changePassword } from "../../api/authApi";
import { getTutorProfile } from "../../api/tutorApi";
import useAuth from "../../hooks/useAuth";
import { User, Lock, LogOut } from "lucide-react";

function TutorSettings() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getTutorProfile();
      setProfile(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile information.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const data = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success(data.message || "Password updated successfully.");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong changing your password."
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading || !profile) {
    return <h2 className="text-center mt-10 text-slate-500 font-medium">Loading...</h2>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        subtitle="Manage your account and security."
      />

      {/* Account Information */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User size={20} className="text-indigo-600 dark:text-indigo-400" /> Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Name</p>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{profile.name}</h3>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Email Address</p>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{profile.email}</h3>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Account Type</p>
            <h3 className="font-semibold capitalize text-lg text-slate-900 dark:text-slate-100">{profile.role}</h3>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Member Since</p>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
              {new Date(profile.createdAt).toLocaleDateString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Security / Change Password */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Lock size={20} className="text-indigo-600 dark:text-indigo-400" /> Security & Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5 text-sm">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5 text-sm">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5 text-sm">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md shadow-indigo-600/20"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Danger Zone / Logout */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">Session Management</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Log out of your current workspace session. You will need your credentials to log back in.
        </p>
        <button
          onClick={handleLogout}
          className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md shadow-rose-600/20 flex items-center gap-2"
        >
          <LogOut size={18} /> Logout Account
        </button>
      </div>
    </div>
  );
}

export default TutorSettings;
