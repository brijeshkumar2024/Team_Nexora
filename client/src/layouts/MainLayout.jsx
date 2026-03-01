import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";

const MainLayout = () => {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
