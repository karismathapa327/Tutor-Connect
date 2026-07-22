import { useEffect, useState } from "react";
import { FileText, Download, Upload, Search, Trash2, ExternalLink, Filter } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import EmptyState from "../../components/dashboard/EmptyState";
import { TableSkeleton } from "../../components/common/Skeleton";
import { getResources, uploadResource, deleteResource } from "../../api/featureApi";

function LearningResources() {
  const { user } = useAuth();
  const isTutor = user?.role === "tutor";

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  // Modal / Form state for Tutor Upload
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    fileType: "PDF",
    externalUrl: "",
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [selectedSubject, search]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getResources({ subject: selectedSubject, search: search.trim() });
      setResources(data.resources || []);
    } catch (err) {
      console.error("Failed to load resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subject) return;

    try {
      setSubmitting(true);
      const postData = new FormData();
      postData.append("title", formData.title);
      postData.append("description", formData.description);
      postData.append("subject", formData.subject);
      postData.append("fileType", formData.fileType);
      if (formData.externalUrl) postData.append("externalUrl", formData.externalUrl);
      if (file) postData.append("resourceFile", file);

      await uploadResource(postData);
      setShowUploadModal(false);
      setFormData({ title: "", description: "", subject: "", fileType: "PDF", externalUrl: "" });
      setFile(null);
      fetchResources();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this learning resource?")) return;
    try {
      await deleteResource(id);
      fetchResources();
    } catch (err) {
      console.error(err);
    }
  };

  const subjects = [...new Set(resources.map((r) => r.subject))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="text-indigo-600 dark:text-indigo-400" size={28} /> Learning Resources & Materials
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Access study guides, course notes, lecture PDFs, and practice assignments.
          </p>
        </div>

        {isTutor && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Upload size={16} /> Upload New Material
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources by title, subject or topic..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full sm:w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Subjects</option>
          {subjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* Resources Table / List */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : resources.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Learning Resources Found"
          description="There are currently no study materials uploaded for this subject filter."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Title & Description</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Uploaded By</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {resources.map((res) => (
                  <tr key={res._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{res.title}</div>
                      {res.description && <div className="text-slate-400 text-[11px] mt-0.5 line-clamp-1">{res.description}</div>}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 font-medium">
                        {res.subject}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                        {res.fileType}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                      {res.tutor?.name || "Tutor"}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <a
                        href={res.fileUrl.startsWith("http") ? res.fileUrl : `http://localhost:5000${res.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-100 transition"
                      >
                        <Download size={14} /> Download / View
                      </a>

                      {(isTutor && res.tutor?._id === user?._id || user?.role === "admin") && (
                        <button
                          onClick={() => handleDelete(res._id)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 transition"
                          title="Delete Material"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Modal for Tutors */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Upload Learning Resource</h3>
            
            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Data Structures Chapter 3 Notes"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Computer Science / Math"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Resource Type</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Document">Document</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Link">Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">File Attachment</label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-slate-500 text-[10px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Or External URL / Drive Link</label>
                <input
                  type="url"
                  value={formData.externalUrl}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Description (Optional)</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of what this document covers..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? "Uploading..." : "Publish Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningResources;
