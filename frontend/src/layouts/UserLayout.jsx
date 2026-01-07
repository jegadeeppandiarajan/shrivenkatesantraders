import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/orders", label: "Orders" },
  { to: "/cart", label: "Cart" },
];

const UserLayout = () => (
  <div className="min-h-screen bg-brand-light dark:bg-dark-bg transition-colors duration-300">
    <Navbar />
    <div className="max-w-6xl mx-auto py-8 px-4">
      <nav className="flex gap-4 mb-6 overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-sm font-semibold transition ${isActive ? "bg-gradient-to-r from-brand-primary to-brand-gold text-white shadow-lg" : "bg-white dark:bg-dark-card text-slate-700 dark:text-dark-text hover:bg-brand-light dark:hover:bg-dark-hover border border-brand-primary/20"}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <section className="bg-white dark:bg-dark-card shadow-sm rounded-2xl border border-brand-primary/10 dark:border-brand-primary/20">
        <Outlet />
      </section>
    </div>
  </div>
);

export default UserLayout;
