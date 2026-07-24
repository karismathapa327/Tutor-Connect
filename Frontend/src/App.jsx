import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import ErrorBoundary from "./components/common/ErrorBoundary";

const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const TutorDashboard = lazy(() => import("./pages/tutor/TutorDashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const FindTutors = lazy(() => import("./pages/student/FindTutors"));
const StudentSessions = lazy(() => import("./pages/student/StudentSessions"));
const StudentRequests = lazy(() => import("./pages/student/StudentRequests"));
const StudentProfile = lazy(() => import("./pages/student/StudentProfile"));
const StudentSettings = lazy(() => import("./pages/student/StudentSettings"));
const StudentPayments = lazy(() => import("./pages/student/StudentPayments"));
const StudentMilestones = lazy(() => import("./pages/student/StudentMilestones"));
const FavoriteTutors = lazy(() => import("./pages/student/FavoriteTutors"));
const LearningResources = lazy(() => import("./pages/student/LearningResources"));
const TutorProfile = lazy(() => import("./pages/student/TutorProfile"));

const TutorRequests = lazy(() => import("./pages/tutor/TutorRequests"));
const TutorSessions = lazy(() => import("./pages/tutor/TutorSessions"));
const TutorSettings = lazy(() => import("./pages/tutor/TutorSettings"));
const TutorProfiles = lazy(() => import("./pages/tutor/TutorProfiles"));
const TutorReviews = lazy(() => import("./pages/tutor/TutorReviews"));
const TutorPayments = lazy(() => import("./pages/tutor/TutorPayments"));
const TutorResources = lazy(() => import("./pages/tutor/TutorResources"));
const TutorAvailability = lazy(() => import("./pages/tutor/TutorAvailability"));

const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminTutors = lazy(() => import("./pages/admin/AdminTutors"));
const AdminSessions = lazy(() => import("./pages/admin/AdminSessions"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
const AdminVerifications = lazy(() => import("./pages/admin/AdminVerifications"));
const Notifications = lazy(() => import("./pages/Notifications"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Landing />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="*" element={<NotFound />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="student">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Suspense fallback={<LoadingFallback />}><StudentDashboard /></Suspense>} />
            <Route path="tutors" element={<Suspense fallback={<LoadingFallback />}><FindTutors /></Suspense>} />
            <Route path="sessions" element={<Suspense fallback={<LoadingFallback />}><StudentSessions /></Suspense>} />
            <Route path="requests" element={<Suspense fallback={<LoadingFallback />}><StudentRequests /></Suspense>} />
            <Route path="favorites" element={<Suspense fallback={<LoadingFallback />}><FavoriteTutors /></Suspense>} />
            <Route path="resources" element={<Suspense fallback={<LoadingFallback />}><LearningResources /></Suspense>} />
            <Route path="payments" element={<Suspense fallback={<LoadingFallback />}><StudentPayments /></Suspense>} />
            <Route path="milestones" element={<Suspense fallback={<LoadingFallback />}><StudentMilestones /></Suspense>} />
            <Route path="profile" element={<Suspense fallback={<LoadingFallback />}><StudentProfile /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<LoadingFallback />}><StudentSettings /></Suspense>} />
            <Route path="notifications" element={<Suspense fallback={<LoadingFallback />}><Notifications /></Suspense>} />
            <Route
                path="tutors/:id"
                element={<Suspense fallback={<LoadingFallback />}><TutorProfile /></Suspense>}
            />
          </Route>
          
          <Route
            path="/tutor"
            element={
              <ProtectedRoute allowedRole="tutor">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
          <Route path="dashboard" element={<Suspense fallback={<LoadingFallback />}><TutorDashboard /></Suspense>} />

            <Route path="profile" element={<Suspense fallback={<LoadingFallback />}><TutorProfiles /></Suspense>} />
            <Route path="requests" element={<Suspense fallback={<LoadingFallback />}><TutorRequests /></Suspense>} />
            <Route path="sessions" element={<Suspense fallback={<LoadingFallback />}><TutorSessions /></Suspense>} />
            <Route path="subjects" element={<Suspense fallback={<LoadingFallback />}><TutorReviews /></Suspense>} />
            <Route path="resources" element={<Suspense fallback={<LoadingFallback />}><TutorResources /></Suspense>} />
            <Route path="payments" element={<Suspense fallback={<LoadingFallback />}><TutorPayments /></Suspense>} />
            <Route path="availability" element={<Suspense fallback={<LoadingFallback />}><TutorAvailability /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<LoadingFallback />}><TutorSettings /></Suspense>} />
            <Route path="notifications" element={<Suspense fallback={<LoadingFallback />}><Notifications /></Suspense>} />

          </Route>
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Suspense fallback={<LoadingFallback />}><AdminDashboard /></Suspense>} />
            <Route path="users" element={<Suspense fallback={<LoadingFallback />}><AdminUsers /></Suspense>} />
            <Route path="tutors" element={<Suspense fallback={<LoadingFallback />}><AdminTutors /></Suspense>} />
            <Route path="sessions" element={<Suspense fallback={<LoadingFallback />}><AdminSessions /></Suspense>} />
            <Route path="payments" element={<Suspense fallback={<LoadingFallback />}><AdminPayments /></Suspense>} />
            <Route path="reports" element={<Suspense fallback={<LoadingFallback />}><AdminReviews /></Suspense>} />
            <Route path="verifications" element={<Suspense fallback={<LoadingFallback />}><AdminVerifications /></Suspense>} />
            <Route path="settings" element={<Suspense fallback={<LoadingFallback />}><AdminSettings /></Suspense>} />
            <Route path="notifications" element={<Suspense fallback={<LoadingFallback />}><Notifications /></Suspense>} />
          </Route>
          
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;