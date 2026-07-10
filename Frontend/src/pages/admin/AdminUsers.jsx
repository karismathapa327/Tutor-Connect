import { useEffect, useState } from "react";
import { Search, Trash2, Loader2, Users } from "lucide-react";
import { getUsers, deleteUser } from "../../api/adminApi";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
      );
    });

    setFilteredUsers(filtered);
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await getUsers();

      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Delete "${name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await deleteUser(id);

      const updatedUsers = users.filter((user) => user._id !== id);

      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
            Admin
          </span>
        );

      case "tutor":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
            Tutor
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
            Student
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="animate-spin text-blue-600" size={45} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-red-600">
          Something went wrong
        </h2>

        <p className="mt-2 text-gray-600">{error}</p>

        <button
          onClick={fetchUsers}
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
            Users Management
          </h1>

          <p className="text-gray-500 mt-2">
            Total Users: {users.length}
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
          placeholder="Search by name, email or role..."
          className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Empty State */}

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">

          <Users
            className="mx-auto text-gray-300"
            size={70}
          />

          <h2 className="text-2xl font-bold mt-4">
            No Users Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try another search keyword.
          </p>

        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="text-left p-4">Name</th>

                <th className="text-left p-4">Email</th>

                <th className="text-left p-4">Role</th>

                <th className="text-center p-4">Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredUsers.map((user) => (

                <tr
                  key={user._id}
                  className="border-b hover:bg-slate-50 transition"
                >

                  <td className="p-4 font-medium">
                    {user.name}
                  </td>

                  <td className="p-4">
                    {user.email}
                  </td>

                  <td className="p-4">
                    {getRoleBadge(user.role)}
                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() =>
                        handleDelete(user._id, user.name)
                      }
                      disabled={deletingId === user._id}
                      className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                    >

                      {deletingId === user._id ? (
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={18} />
                      )}

                      Delete

                    </button>

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

export default AdminUsers;