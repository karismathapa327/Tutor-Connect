import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/dashboard/PageHeader";
import { changePassword } from "../../api/authApi";
// Note: Adjust this import path if your tutor profile fetch API is located in a different file
import { getTutorProfile } from "../../api/tutorApi"; 
import useAuth from "../../hooks/useAuth";

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
      // Fetches the logged-in tutor's basic account info
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
    return <h2 className="text-center mt-10 text-gray-500 font-medium">Loading...</h2>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        subtitle="Manage your tutor account configurations and security settings."
      />

      {/* Account Information Section */}
      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-xl font-semibold mb-6">Account Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <h3 className="font-semibold text-lg text-gray-800">{profile.name}</h3>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email Address</p>
            <h3 className="font-semibold text-lg text-gray-800">{profile.email}</h3>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Account Type</p>
            <h3 className="font-semibold text-lg text-gray-800 capitalize">{profile.role}</h3>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Member Since</p>
            <h3 className="font-semibold text-lg text-gray-800">
              {new Date(profile.createdAt).toLocaleDateString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Security / Change Password Section */}
      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-xl font-semibold mb-6">Security & Password</h2>
        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
          <div>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Danger Zone / Logout Section */}
      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Session Management</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Log out of your current workspace session. You will need your credentials to log back in.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
        >
          Logout Account
        </button>
      </div>
    </div>
  );
}

export default TutorSettings;