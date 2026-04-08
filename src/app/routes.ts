import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import DepartmentDetailsPage from "./pages/DepartmentDetailsPage";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import DeptHeadDashboard from "./pages/DeptHeadDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BlogSubmissionPage from "./pages/BlogSubmissionPage";
import BlogManagementPage from "./pages/BlogManagementPage";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
  {
    path: "/departments",
    Component: DepartmentsPage,
  },
  {
    path: "/departments/:id",
    Component: DepartmentDetailsPage,
  },
  {
    path: "/blogs",
    Component: BlogListPage,
  },
  {
    path: "/blogs/:id",
    Component: BlogDetailsPage,
  },
  {
    path: "/announcements",
    Component: AnnouncementsPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/dashboard/student",
    Component: StudentDashboard,
  },
  {
    path: "/dashboard/dept-head",
    Component: DeptHeadDashboard,
  },
  {
    path: "/dashboard/admin",
    Component: AdminDashboard,
  },
  {
    path: "/submit-blog",
    Component: BlogSubmissionPage,
  },
  {
    path: "/blog-management",
    Component: BlogManagementPage,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);