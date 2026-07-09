import { useEffect, useState } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import StatCard from "../../components/dashboard/StatCard";
import { Star, MessageSquare, CalendarCheck } from "lucide-react";
import { getMyTutorProfile, updateTutorProfile, createTutorProfile } from "../../api/tutorApi";
import { toast } from "react-toastify";

function TutorProfiles() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [formData, setFormData] = useState({
    bio: "",
    qualifications: "",
    experience: "",
    hourlyRate: "",
    subjects: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyTutorProfile();

      if (data) {
        setProfile(data);
        setHasProfile(true);
        setFormData({
          bio: data.bio || "",
          qualifications: data.qualifications || "",
          experience: data.experience || "",
          hourlyRate: data.hourlyRate || "",
          subjects: Array.isArray(data.subjects) ? data.subjects.join(", ") : "",
        });
      }
    } catch (error) {
      // Cleanly catch the expected 404 for missing profiles without logging a scary error block
      if (error.response?.status === 404) {
        setHasProfile(false);
      } else {
        // Only log and notify if it's an actual unexpected error (e.g., 500 Server Error)
        console.error("Profile fetch error:", error);
        toast.error("Failed to fetch tutor profile details.");
      }
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

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      const payload = {
        bio: formData.bio,
        qualifications: formData.qualifications,
        experience: Number(formData.experience),
        hourlyRate: Number(formData.hourlyRate),
        subjects: formData.subjects
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
      };

      // Dynamically use createTutorProfile (POST) if new, or updateTutorProfile (PUT) if editing
      if (hasProfile) {
        await updateTutorProfile(payload);
        toast.success("Profile updated successfully.");
      } else {
        await createTutorProfile(payload);
        toast.success("Profile created successfully!");
      }
      
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save profile details."
      );
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10 text-gray-500 font-medium">Loading...</h2>;
  }

  // --- RENDERS INITIAL PROFILE CREATION FORM IF TUTOR HAS NO PROFILE ---
  if (!hasProfile) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Setup Tutor Profile"
          subtitle="Complete your teaching profile fields to start accepting student requests."
        />
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Profile</h2>
          <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-gray-500 font-medium mb-2">Qualifications</label>
              <input
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="e.g. B.Sc. in Computer Science, Certified Math Teacher"
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-500 font-medium mb-2">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-500 font-medium mb-2">Hourly Rate (Rs.)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="e.g. 1200"
                  className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 font-medium mb-2">Bio</label>
              <textarea
                rows="5"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Introduce yourself to potential students, your learning approaches, etc..."
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-500 font-medium mb-2">Subjects (Comma separated)</label>
              <input
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Math, Physics, Computer Science"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition duration-200"
              >
                Create Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- EXISTING STATS & VIEW DETAILS CARD TEMPLATE ---
  const stats = [
    {
      title: "Average Rating",
      value: profile.averageRating || 0,
      icon: Star,
      color: "yellow",
    },
    {
      title: "Total Reviews",
      value: profile.totalReviews || 0,
      icon: Star,
      color: "purple",
    },
    {
      title: "Pending Requests",
      value: profile.pendingRequests || 0,
      icon: MessageSquare,
      color: "blue",
    },
    {
      title: "Completed Sessions",
      value: profile.completedSessions || 0,
      icon: CalendarCheck,
      color: "green",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tutor Profile"
        subtitle="Manage your tutor information."
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500">Name</p>
            <h3 className="font-semibold text-lg">{profile.name}</h3>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <h3 className="font-semibold text-lg">{profile.email}</h3>
          </div>
          <div>
            <p className="text-gray-500">Role</p>
            <h3 className="font-semibold capitalize text-lg">{profile.role}</h3>
          </div>
          <div>
            <p className="text-gray-500">Member Since</p>
            <h3 className="font-semibold text-lg">
              {profile.memberSince ? new Date(profile.memberSince).toLocaleDateString() : "N/A"}
            </h3>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Professional Information</h2>
        <div className="space-y-6">
          <div>
            <p className="text-gray-500">Qualifications</p>
            {editing ? (
              <input
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h3 className="font-semibold">{profile.qualifications}</h3>
            )}
          </div>

          <div>
            <p className="text-gray-500">Experience</p>
            {editing ? (
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h3>{profile.experience} Years</h3>
            )}
          </div>

          <div>
            <p className="text-gray-500">Hourly Rate</p>
            {editing ? (
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h3>Rs. {profile.hourlyRate}/hour</h3>
            )}
          </div>

          <div>
            <p className="text-gray-500">Bio</p>
            {editing ? (
              <textarea
                rows="5"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-2 whitespace-pre-line">{profile.bio}</p>
            )}
          </div>

          <div>
            <p className="text-gray-500 mb-3">Subjects</p>
            {editing ? (
              <input
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Math, Physics, Chemistry"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.subjects?.map((subject) => (
                  <span
                    key={subject}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-gray-500 mb-3">Availability</p>
            {!profile.availability || profile.availability.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No availability slots configured yet.</p>
            ) : (
              <div className="space-y-2">
                {profile.availability.map((slot) => (
                  <div
                    key={slot._id}
                    className="flex justify-between bg-gray-100 rounded-lg p-3 text-sm"
                  >
                    <span className="font-medium">{slot.day}</span>
                    <span className="text-gray-600">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl shadow p-8 flex justify-end">
        {editing ? (
          <div className="space-x-4">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition duration-200"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditing(false);
                fetchProfile();
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-medium transition duration-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition duration-200"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default TutorProfiles;