export function getDashboardPath(role) {
  switch (role) {
    case "student":
      return "/student/dashboard";

    case "tutor":
      return "/tutor/dashboard";

    case "admin":
      return "/admin/dashboard";

    default:
      return "/";
  }
}