import {
  Calendar,
  MessageSquare,
  Search,
  Star,
  CalendarPlus,
} from "lucide-react";

export const studentStats = [
  {
    title: "Upcoming Sessions",
    value: 12,
    subtitle: "2 today",
    icon: Calendar,
    color: "blue",
  },
  {
    title: "Tutor Requests",
    value: 4,
    subtitle: "Pending approval",
    icon: MessageSquare,
    color: "orange",
  },
  {
    title: "Average Rating",
    value: 4.9,
    subtitle: "Excellent",
    icon: Star,
    color: "green",
  },
  {
    title: "Available Tutors",
    value: 58,
    subtitle: "Across all subjects",
    icon: Search,
    color: "purple",
  },
];

export const studentActions = [
  {
    title: "Find Tutors",
    description: "Browse tutors by subject.",
    icon: Search,
    path: "/student/tutors",
  },
  {
    title: "Book Session",
    description: "Schedule a tutoring session.",
    icon: CalendarPlus,
    path: "/student/sessions",
  },
  {
    title: "View Requests",
    description: "Track tutor requests.",
    icon: MessageSquare,
    path: "/student/requests",
  },
];