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
          path="/tutor/dashboard"
          element={
            <ProtectedRoute allowedRole="tutor">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TutorDashboard />} />
        </Route>
        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;