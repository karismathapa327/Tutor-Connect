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
  Heart,
  FileText,
  CreditCard,
  Award,
  ShieldCheck,
  Star,
  Clock,
  Bell,
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
      title: "Favorites",
      icon: Heart,
      path: "/student/favorites",
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
      title: "Resources",
      icon: FileText,
      path: "/student/resources",
    },
    {
      title: "Payments",
      icon: CreditCard,
      path: "/student/payments",
    },
    {
      title: "Certificates",
      icon: Award,
      path: "/student/certificates",
    },
    {
      title: "Notifications",
      icon: Bell,
      path: "/student/notifications",
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
      title: "Availability",
      icon: Clock,
      path: "/tutor/availability",
    },
    {
      title: "Resources",
      icon: FileText,
      path: "/tutor/resources",
    },
    {
      title: "Payments",
      icon: CreditCard,
      path: "/tutor/payments",
    },
    {
      title: "Reviews",
      icon: Star,
      path: "/tutor/subjects",
    },
    {
      title: "Profile & Verification",
      icon: ShieldCheck,
      path: "/tutor/profile",
    },
    {
      title: "Notifications",
      icon: Bell,
      path: "/tutor/notifications",
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
      icon: Calendar,
      path: "/admin/sessions",
    },
    {
      title: "Payments",
      icon: CreditCard,
      path: "/admin/payments",
    },
    {
      title: "Reports & Reviews",
      icon: BarChart3,
      path: "/admin/reports",
    },
    {
      title: "Notifications",
      icon: Bell,
      path: "/admin/notifications",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ],
};