import { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  CalendarDays,
} from "lucide-react";

import { getSessions } from "../../api/adminApi";

function AdminSessions() {

  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {

    const filtered = sessions.filter((session) => {

      return (

        session.student?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        session.tutor?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        session.subject
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||

        session.topic
          ?.toLowerCase()
          .includes(search.toLowerCase())

      );

    });

    setFilteredSessions(filtered);

  }, [search, sessions]);

  const fetchSessions = async () => {

    try {

      setLoading(true);
      setError("");

      const { data } = await getSessions();

      setSessions(data.sessions);
      setFilteredSessions(data.sessions);

    } catch (err) {

      console.error(err);
      setError("Failed to load sessions.");

    } finally {

      setLoading(false);

    }

  };

  const getStatusBadge = (status) => {

    switch (status) {

      case "Upcoming":
        return (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
            Upcoming
          </span>
        );

      case "Completed":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
            Completed
          </span>
        );

      case "Cancelled":
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
            Cancelled
          </span>
        );

      default:
        return status;

    }

  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2
          size={45}
          className="animate-spin text-blue-600"
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

        <p className="mt-3">
          {error}
        </p>

        <button
          onClick={fetchSessions}
          className="mt-5 bg-red-600 text-white px-5 py-2 rounded-lg"
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
            Sessions
          </h1>

          <p className="text-gray-500 mt-2">
            Total Sessions : {sessions.length}
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
          placeholder="Search sessions..."
          className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* Empty */}

      {filteredSessions.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-12 text-center">

          <CalendarDays
            size={70}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-2xl font-bold mt-4">
            No Sessions Found
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
                  Student
                </th>

                <th className="p-4 text-left">
                  Tutor
                </th>

                <th className="p-4 text-left">
                  Subject
                </th>

                <th className="p-4 text-left">
                  Topic
                </th>

                <th className="p-4 text-center">
                  Date
                </th>

                <th className="p-4 text-center">
                  Time
                </th>

                <th className="p-4 text-center">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredSessions.map((session) => (

                <tr
                  key={session._id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-4">
                    {session.student?.name}
                  </td>

                  <td className="p-4">
                    {session.tutor?.name}
                  </td>

                  <td className="p-4">
                    {session.subject}
                  </td>

                  <td className="p-4">
                    {session.topic}
                  </td>

                  <td className="p-4 text-center">
                    {new Date(session.sessionDate).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-center">
                    {session.sessionTime}
                  </td>

                  <td className="p-4 text-center">
                    {getStatusBadge(session.status)}
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

export default AdminSessions;