import { Outlet } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col bg-brand-light dark:bg-dark-bg transition-colors duration-300">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;

