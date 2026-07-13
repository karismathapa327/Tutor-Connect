import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/student/StudentDashboard";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import FindTutors from "./pages/student/FindTutors";
import StudentSessions from "./pages/student/StudentSessions";
import StudentRequests from "./pages/student/StudentRequests";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSettings from "./pages/student/StudentSettings";
import TutorProfile from "./pages/student/TutorProfile";

import TutorRequests from "./pages/tutor/TutorRequests";
import TutorSessions from "./pages/tutor/TutorSessions";
import TutorSettings from "./pages/tutor/TutorSettings";
import TutorProfiles from "./pages/tutor/TutorProfiles";
import TutorReviews from "./pages/tutor/TutorReviews";

import AdminUsers from "./pages/admin/AdminUsers";
import AdminTutors from "./pages/admin/AdminTutors";
import AdminSessions from "./pages/admin/AdminSessions";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  return (
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
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="tutors" element={<FindTutors />} />
          <Route path="sessions" element={<StudentSessions />} />
          <Route path="requests" element={<StudentRequests />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="settings" element={<StudentSettings />} />
          <Route
              path="tutors/:id"
              element={<TutorProfile />}
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
        <Route path="dashboard" element={<TutorDashboard />} />

          <Route path="profile" element={<TutorProfiles />} />
          <Route path="requests" element={<TutorRequests />} />
          <Route path="sessions" element={<TutorSessions />} />
          <Route path="subjects" element={<TutorReviews />} />
          <Route path="settings" element={<TutorSettings />} />

        </Route>
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="tutors" element={<AdminTutors />} />
          <Route path="sessions" element={<AdminSessions />} />
          <Route path="reports" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;