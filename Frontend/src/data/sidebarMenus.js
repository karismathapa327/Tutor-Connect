import {
  LayoutDashboard,
  Search,
  Calendar,
  MessageSquare,
  User,
  Settings,
  BookOpen,
  Users,
  BarChart3,
} from "lucide-react";

export const sidebarMenus = {
  student: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/student/dashboard",
    },
    {
      title: "Find Tutors",
      icon: Search,
      path: "/student/tutors",
    },
    {
      title: "Sessions",
      icon: Calendar,
      path: "/student/sessions",
    },
    {
      title: "Requests",
      icon: MessageSquare,
      path: "/student/requests",
    },
    {
      title: "Profile",
      icon: User,
      path: "/student/profile",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/student/settings",
    },
  ],

  tutor: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/tutor/dashboard",
    },
    {
      title: "Subjects",
      icon: BookOpen,
      path: "/tutor/subjects",
    },
    {
      title: "Sessions",
      icon: Calendar,
      path: "/tutor/sessions",
    },
    {
      title: "Requests",
      icon: MessageSquare,
      path: "/tutor/requests",
    },
    {
      title: "Profile",
      icon: User,
      path: "/tutor/profile",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/tutor/settings",
    },
  ],

  admin: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      title: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Tutors",
      icon: BookOpen,
      path: "/admin/tutors",
    },
    {
      title: "Sessions",
      icon: User,
      path: "/admin/sessions",
    },
    {
      title: "Reports",
      icon: BarChart3,
      path: "/admin/reports",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ],
};