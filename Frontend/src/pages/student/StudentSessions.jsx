import { useEffect, useState } from "react";
import { Calendar, CheckCircle2, XCircle, Clock, Star, X, CreditCard, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { getSessions, createReview, cancelSession } from "../../api/studentApi";
import { processPayment } from "../../api/featureApi";
import EmptyState from "../../components/dashboard/EmptyState";
import { TableSkeleton } from "../../components/common/Skeleton";

function StudentSessions() {
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  const [selectedSession, setSelectedSession] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, review: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [paymentSession, setPaymentSession] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(25);

  const [cancelSessionId, setCancelSessionId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [activeTab]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params = activeTab !== "All" ? { status: activeTab } : {};
      const data = await getSessions(params);
      setSessions(data.sessions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelSessionId) return;
    try {
      setCancelling(true);
      await cancelSession(cancelSessionId);
      setCancelSessionId(null);
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel session");
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSession) return;
    try {
      setSubmittingReview(true);
      await createReview({
        sessionId: selectedSession._id,
        rating: Number(reviewData.rating),
        review: reviewData.review,
      });
      setSelectedSession(null);
      setReviewData({ rating: 5, review: "" });
      fetchSessions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!paymentSession) return;
    try {
      setProcessingPayment(true);
      await processPayment({
        tutorId: paymentSession.tutor._id,
        sessionId: paymentSession._id,
        amount: Number(paymentAmount),
        paymentMethod: "e-Wallet Sandbox",
      });
      setPaymentSession(null);
      setPaymentAmount(25);
      toast.success("Simulated payment completed.");
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment processing failed");
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calendar className="text-indigo-600 dark:text-indigo-400" size={28} /> My Tutoring Sessions
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your scheduled, completed, and cancelled peer tutoring sessions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-sm font-semibold">
        {["All", "Upcoming", "Completed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 transition relative ${
              activeTab === tab
                ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            {tab} Sessions
          </button>
        ))}
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab} Sessions Found`}
          description="You don't have any sessions in this category yet."
          buttonText="Find & Book Tutors"
          buttonLink="/student/tutors"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    {session.subject}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase border ${
                      session.status === "Upcoming"
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 border-blue-200"
                        : session.status === "Completed"
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200"
                        : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-200"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {session.topic}
                </h3>

                <div className="mt-3 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200">Tutor:</strong> {session.tutor?.name || "Tutor"}
                  </p>
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200">Date:</strong> {new Date(session.sessionDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong className="text-slate-800 dark:text-slate-200">Time Slot:</strong> {session.sessionTime}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 justify-end">
                {session.status === "Upcoming" && (
                  <>
                     <button
                      onClick={() => { setPaymentSession(session); setPaymentAmount(25); }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
                    >
                      <CreditCard size={14} /> Pay Fee
                    </button>
                     <button
                      onClick={() => setCancelSessionId(session._id)}
                      className="px-3.5 py-2 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      Cancel Session
                    </button>
                  </>
                )}

                {session.status === "Completed" && (
                  <button
                    onClick={() => setSelectedSession(session)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <Star size={14} /> Leave Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Review Session with {selectedSession.tutor?.name}
              </h3>
              <button onClick={() => setSelectedSession(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Rating</label>
                <select
                  value={reviewData.rating}
                  onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                  <option value={2}>⭐⭐ (2 Stars - Poor)</option>
                  <option value={1}>⭐ (1 Star - Terrible)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Your Review Feedback</label>
                <textarea
                  rows="3"
                  required
                  value={reviewData.review}
                  onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                  placeholder="Share how helpful this session was..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSession(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelSessionId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center">
                <AlertTriangle className="text-rose-600" size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Cancel Session?</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">This will cancel your upcoming session. This action cannot be undone.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setCancelSessionId(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium">Keep Session</button>
              <button onClick={handleCancelConfirm} disabled={cancelling} className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold disabled:opacity-50 transition">{cancelling ? "Cancelling..." : "Yes, Cancel"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Payment Checkout Modal */}
      {paymentSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CreditCard className="text-emerald-500" size={20} /> Simulated Checkout
              </h3>
              <button onClick={() => setPaymentSession(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs space-y-1">
              <p><strong className="text-slate-700 dark:text-slate-300">Subject:</strong> {paymentSession.subject}</p>
              <p><strong className="text-slate-700 dark:text-slate-300">Tutor:</strong> {paymentSession.tutor?.name}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Amount:</span>
                <div className="flex items-center gap-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-right text-sm font-extrabold text-emerald-700 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              * Note: This is a safe simulated payment module for your BSc CSIT project demonstration.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPaymentSession(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulatePayment}
                disabled={processingPayment}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50 transition shadow-md shadow-emerald-600/20"
              >
                {processingPayment ? "Processing..." : "Confirm & Complete Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentSessions;