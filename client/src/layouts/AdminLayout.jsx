import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="section-shell py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
