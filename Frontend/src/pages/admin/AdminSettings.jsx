import { useState, useEffect } from "react";
import { User, Mail, Lock, Save } from "lucide-react";
import PageHeader from "../../components/dashboard/PageHeader";
import { getProfile, changePassword } from "../../api/authApi";
import { toast } from "react-toastify";

function AdminSettings() {
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
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error(error);
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

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
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
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10 text-slate-500 font-medium">Loading...</h2>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        subtitle="Manage your admin account and security settings."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-slate-100">Account Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-slate-500 text-sm">Name</p>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{profile?.name}</h3>
          </div>
          <div>
            <p className="text-slate-500 text-sm">Email Address</p>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{profile?.email}</h3>
          </div>
          <div>
            <p className="text-slate-500 text-sm">Account Type</p>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 capitalize">{profile?.role}</h3>
          </div>
          <div>
            <p className="text-slate-500 text-sm">Member Since</p>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-slate-100">Security & Password</h2>
        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Current Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">New Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3.5 text-slate-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center gap-2"
          >
            <Save size={18} /> Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminSettings;
