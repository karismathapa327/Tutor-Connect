import { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  GraduationCap,
  Star,
} from "lucide-react";

import { getTutors } from "../../api/adminApi";

function AdminTutors() {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchTutors();
  }, []);

  useEffect(() => {
    const filtered = tutors.filter((tutor) => {
      return (
        tutor.user?.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        tutor.qualifications
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        tutor.subjects
          .join(", ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });

    setFilteredTutors(filtered);
  }, [search, tutors]);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await getTutors();

      setTutors(data.tutors);
      setFilteredTutors(data.tutors);

    } catch (err) {

      console.error(err);
      setError("Failed to load tutor profiles.");

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2
          className="animate-spin text-blue-600"
          size={45}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">

        <h2 className="text-2xl font-bold text-red-600">
          Something went wrong
        </h2>

        <p className="mt-3 text-gray-600">
          {error}
        </p>

        <button
          onClick={fetchTutors}
          className="mt-5 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>

      </div>
    );
  }

  return (
    <div>

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Tutor Profiles
          </h1>

          <p className="text-gray-500 mt-2">
            Total Tutors : {tutors.length}
          </p>

        </div>

      </div>

      {/* Search */}

      <div className="relative mb-6">

        <Search
          className="absolute left-4 top-3.5 text-gray-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search tutor..."
          className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* Empty */}

      {filteredTutors.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-12 text-center">

          <GraduationCap
            size={70}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-2xl font-bold mt-4">
            No Tutors Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try another search.
          </p>

        </div>

      ) : (

        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Subjects
                </th>

                <th className="p-4 text-left">
                  Qualification
                </th>

                <th className="p-4 text-center">
                  Experience
                </th>

                <th className="p-4 text-center">
                  Hourly Rate
                </th>

                <th className="p-4 text-center">
                  Rating
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredTutors.map((tutor) => (

                <tr
                  key={tutor._id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-4 font-medium">
                    {tutor.user?.name}
                  </td>

                  <td className="p-4">
                    {tutor.subjects.join(", ")}
                  </td>

                  <td className="p-4">
                    {tutor.qualifications}
                  </td>

                  <td className="p-4 text-center">
                    {tutor.experience} yrs
                  </td>

                  <td className="p-4 text-center">
                    Rs. {tutor.hourlyRate}
                  </td>

                  <td className="p-4">

                    <div className="flex justify-center items-center gap-2">

                      <Star
                        size={18}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      {Number(
                        tutor.averageRating
                      ).toFixed(1)}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default AdminTutors;