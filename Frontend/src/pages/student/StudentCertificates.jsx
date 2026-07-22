import { useEffect, useState } from "react";
import { Award, Download, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { jsPDF } from "jspdf";
import useAuth from "../../hooks/useAuth";
import EmptyState from "../../components/dashboard/EmptyState";
import { CardSkeleton } from "../../components/common/Skeleton";
import { getMyCertificates, generateCertificate } from "../../api/featureApi";
import { getSessions } from "../../api/studentApi";

function StudentCertificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchCertificatesAndSessions();
  }, []);

  const fetchCertificatesAndSessions = async () => {
    try {
      setLoading(true);
      const certData = await getMyCertificates();
      setCertificates(certData.certificates || []);

      const sessionData = await getSessions({ status: "Completed" });
      setCompletedSessions(sessionData.sessions || []);
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimCertificate = async (tutorId, subject) => {
    try {
      setGenerating(true);
      const res = await generateCertificate({ tutorId, subject });
      fetchCertificatesAndSessions();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = (cert) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Background & Borders
    doc.setFillColor(252, 253, 255);
    doc.rect(0, 0, width, height, "F");

    doc.setDrawColor(79, 70, 229); // Indigo border
    doc.setLineWidth(12);
    doc.rect(20, 20, width - 40, height - 40);

    doc.setDrawColor(217, 119, 6); // Amber inner border
    doc.setLineWidth(2);
    doc.rect(30, 30, width - 60, height - 60);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(30, 41, 59);
    doc.text("ONLINE TUTORING PLATFORM", width / 2, 100, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(79, 70, 229);
    doc.text("CERTIFICATE OF COMPLETION", width / 2, 135, { align: "center" });

    // Body text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text("This is proudly presented to", width / 2, 185, { align: "center" });

    // Student Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(15, 23, 42);
    doc.text(user?.name?.toUpperCase() || "STUDENT NAME", width / 2, 235, { align: "center" });

    // Details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `for successfully completing peer tutoring coursework and sessions in`,
      width / 2,
      280,
      { align: "center" }
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229);
    doc.text(cert.subject?.toUpperCase(), width / 2, 320, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Under the guidance of Tutor: ${cert.tutor?.name || "Verified Tutor"}`,
      width / 2,
      360,
      { align: "center" }
    );

    // Footer Credentials
    doc.setLineWidth(1);
    doc.setDrawColor(226, 232, 240);
    doc.line(100, 430, width - 100, 430);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`CERTIFICATE ID: ${cert.certificateId}`, 100, 460);
    doc.text(
      `ISSUED ON: ${new Date(cert.issueDate || cert.createdAt).toLocaleDateString()}`,
      width - 100,
      460,
      { align: "right" }
    );

    doc.save(`Certificate_${cert.subject}_${cert.certificateId}.pdf`);
  };

  // Group completed sessions by subject & tutor to check eligible unclaimed certificates
  const eligibleGrouped = completedSessions.reduce((acc, sess) => {
    const key = `${sess.tutor?._id}_${sess.subject}`;
    if (!acc[key]) {
      acc[key] = {
        tutorId: sess.tutor?._id,
        tutorName: sess.tutor?.name,
        subject: sess.subject,
        count: 0,
      };
    }
    acc[key].count += 1;
    return acc;
  }, {});

  const eligibleList = Object.values(eligibleGrouped);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="text-amber-500" size={28} /> Certificates & Milestone Achievements
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Earn and download official PDF certificates of completion for your completed tutoring milestones.
        </p>
      </div>

      {/* Eligible Milestone Claim Banner */}
      {eligibleList.length > 0 && (
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm tracking-wide uppercase">
            <Sparkles size={18} /> Milestone Certificates Available
          </div>
          <p className="text-indigo-200 text-xs max-w-2xl">
            You have completed tutoring sessions! Claim your formal certificate of completion below.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {eligibleList.map((item) => {
              const alreadyClaimed = certificates.some(
                (c) => c.subject === item.subject && c.tutor?._id === item.tutorId
              );
              if (alreadyClaimed) return null;

              return (
                <button
                  key={`${item.tutorId}_${item.subject}`}
                  onClick={() => handleClaimCertificate(item.tutorId, item.subject)}
                  disabled={generating}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
                >
                  <Award size={16} /> Claim {item.subject} Certificate ({item.count} Session)
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Earned Certificates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
        </div>
      ) : certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Certificates Issued Yet"
          description="Complete tutoring sessions with your tutors to earn official PDF certificates of completion!"
          buttonText="View My Sessions"
          buttonLink="/student/sessions"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-6 shadow-sm hover:shadow-xl transition relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-bold text-xs rounded-full border border-amber-200 dark:border-amber-800/40 flex items-center gap-1">
                    <ShieldCheck size={14} /> Official Credential
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {cert.certificateId}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-4">
                  {cert.subject} Completion Certificate
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Issued to <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span> for completing tutoring sessions under <span className="font-semibold text-slate-800 dark:text-slate-200">{cert.tutor?.name || "Tutor"}</span>.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                  <span>Issued Date: {new Date(cert.issueDate || cert.createdAt).toLocaleDateString()}</span>
                  <span>Verified BSc CSIT Standard</span>
                </div>
              </div>

              <button
                onClick={() => downloadPDF(cert)}
                className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download Official PDF Certificate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentCertificates;
