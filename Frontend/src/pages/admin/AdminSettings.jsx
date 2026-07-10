import { useState } from "react";
import { User, Mail, Lock, Save } from "lucide-react";

function AdminSettings() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    // TODO:
    // Call update profile API
    // Call change password API

    alert("Settings saved successfully.");
  };

  return (
    <div className="max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Admin Settings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-8 space-y-6"
      >

        {/* Name */}

        <div>

          <label className="font-medium mb-2 block">
            Full Name
          </label>

          <div className="relative">

            <User
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              type="text"
              name="name"
              className="w-full border rounded-lg pl-10 pr-4 py-3"
              value={formData.name}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Email */}

        <div>

          <label className="font-medium mb-2 block">
            Email
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              type="email"
              name="email"
              className="w-full border rounded-lg pl-10 pr-4 py-3"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

        </div>

        <hr />

        <h2 className="text-xl font-semibold">
          Change Password
        </h2>

        {/* Current Password */}

        <div>

          <label className="font-medium mb-2 block">
            Current Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              type="password"
              name="currentPassword"
              className="w-full border rounded-lg pl-10 pr-4 py-3"
              value={formData.currentPassword}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* New Password */}

        <div>

          <label className="font-medium mb-2 block">
            New Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              type="password"
              name="newPassword"
              className="w-full border rounded-lg pl-10 pr-4 py-3"
              value={formData.newPassword}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Confirm Password */}

        <div>

          <label className="font-medium mb-2 block">
            Confirm Password
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              type="password"
              name="confirmPassword"
              className="w-full border rounded-lg pl-10 pr-4 py-3"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

          </div>

        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Save size={18} />
          Save Changes
        </button>

      </form>

    </div>
  );
}

export default AdminSettings;