import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/dashboard/PageHeader";

import {
  getStudentProfile,
} from "../../api/studentApi";

import {
  changePassword,
} from "../../api/authApi";

import useAuth from "../../hooks/useAuth";

function StudentSettings() {

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

      const data = await getStudentProfile();

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

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {

      toast.error("Passwords do not match.");

      return;

    }

    try {

      const data = await changePassword({
        currentPassword:
          formData.currentPassword,

        newPassword:
          formData.newPassword,
      });

      toast.success(data.message);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );

    }

  };

  const handleLogout = () => {
  logout();
  navigate("/login");
};

  if (loading) {

    return <h2>Loading...</h2>;

  }

  return (

    <div className="space-y-8">

      <PageHeader
        title="Settings"
        subtitle="Manage your account and security."
      />

      {/* Account Information */}

      <div className="bg-white rounded-2xl shadow p-8">

        <h2 className="text-xl font-semibold mb-6">

          Account Information

        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <p className="text-gray-500">
              Name
            </p>

            <h3 className="font-semibold">
              {profile.name}
            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Email
            </p>

            <h3 className="font-semibold">
              {profile.email}
            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Role
            </p>

            <h3 className="font-semibold capitalize">
              {profile.role}
            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Member Since
            </p>

            <h3 className="font-semibold">

              {new Date(
                profile.createdAt
              ).toLocaleDateString()}

            </h3>

          </div>

        </div>

      </div>

      {/* Change Password */}

      <div className="bg-white rounded-2xl shadow p-8">

        <h2 className="text-xl font-semibold mb-6">

          Change Password

        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >

            Update Password

          </button>

        </form>

      </div>

      {/* Logout */}

      <div className="bg-white rounded-2xl shadow p-8">

        <h2 className="text-xl font-semibold mb-6">

          Account

        </h2>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>

  );

}

export default StudentSettings;