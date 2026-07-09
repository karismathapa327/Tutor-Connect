import {
  Calendar,
  CalendarCheck,
  MessageSquare,
  Star,
  User,
  ClipboardList,
} from "lucide-react";

export const tutorStats = [
  {
    title: "Pending Requests",
    value: 0,
    icon: MessageSquare,
    color: "yellow",
  },
  {
    title: "Upcoming Sessions",
    value: 0,
    icon: Calendar,
    color: "blue",
  },
  {
    title: "Completed Sessions",
    value: 0,
    icon: CalendarCheck,
    color: "green",
  },
  {
    title: "Average Rating",
    value: 0,
    icon: Star,
    color: "purple",
  },
];

export const tutorActions = [
  {
    title: "My Profile",
    icon: User,
    link: "/tutor/profile",
  },
  {
    title: "Requests",
    icon: ClipboardList,
    link: "/tutor/requests",
  },
  {
    title: "Sessions",
    icon: Calendar,
    link: "/tutor/sessions",
  },
];