import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ShieldCheck,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { getPendingVerifications, updateVerificationStatus } from "../../api/adminApi";
import EmptyState from "../../components/dashboard/EmptyState";

function AdminVerifications() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const { data } = await getPendingVerifications();
      setTutors(data.tutors || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load verifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (profileId, status) => {
    try {
      setActionLoading(profileId + status);
      const { data } = await updateVerificationStatus(profileId, { status });
      toast.success(data.message);
      fetchVerifications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredTutors = tutors.filter((t) =>
    t.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-200">
            Pending
          </span>
        );
      case "Approved":
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200">
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs font-semibold">
            {status}
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={28} /> Tutor Verifications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review and approve tutor verification documents.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by tutor name..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filteredTutors.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No Pending Verifications"
          description="There are no tutor verification requests pending review."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Tutor</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Qualifications</th>
                  <th className="p-4">Documents</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTutors.map((tutor) => (
                  <tr key={tutor._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                      {tutor.user?.name || "N/A"}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{tutor.user?.email || "N/A"}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{tutor.qualifications || "N/A"}</td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedTutor(tutor)}
                        className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-medium flex items-center gap-1 hover:bg-indigo-100 transition"
                        title="View Documents"
                      >
                        <Eye size={14} /> {tutor.verificationDocs?.length || 0} files
                      </button>
                    </td>
                    <td className="p-4">{getStatusBadge(tutor.verificationStatus)}</td>
                    <td className="p-4 text-right">
                      {tutor.verificationStatus === "Pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusUpdate(tutor._id, "Approved")}
                            disabled={actionLoading === tutor._id + "Approved"}
                            className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 transition"
                            title="Approve"
                          >
                            {actionLoading === tutor._id + "Approved" ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(tutor._id, "Rejected")}
                            disabled={actionLoading === tutor._id + "Rejected"}
                            className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100 disabled:opacity-50 transition"
                            title="Reject"
                          >
                            {actionLoading === tutor._id + "Rejected" ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <XCircle size={16} />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedTutor && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Verification Documents — {selectedTutor.user?.name}
              </h3>
              <button onClick={() => setSelectedTutor(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {selectedTutor.verificationDocs?.length === 0 ? (
                <p className="text-sm text-slate-500">No documents uploaded.</p>
              ) : (
                selectedTutor.verificationDocs?.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{doc.docType || "Document"}</p>
                      <p className="text-xs text-slate-500">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={doc.docUrl.startsWith("http") ? doc.docUrl : `http://localhost:5000${doc.docUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                      View Document
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVerifications;
