import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ApplyPage from "./pages/ApplyPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={["admin", "lead"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
