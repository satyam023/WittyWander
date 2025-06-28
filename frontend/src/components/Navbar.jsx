import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaUserPlus,
  FaChartBar,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Logout from "../pages/Logout";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  <Logout onLogout={logout} />;

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = {
    authenticated: [
      { to: "/home", icon: <FaHome />, label: "Home" },
      { to: "/dashboard", icon: <FaChartBar />, label: "Dashboard" },
    ],
    unauthenticated: [
      { to: "/login", icon: <FaUser />, label: "Login" },
      {
        to: "/signup",
        icon: <FaUserPlus />,
        label: "Signup",
        className:
          "bg-blue-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold",
      },
    ],
  };

  return (
    <nav className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to={user && "/home"}
            className={`text-2xl font-bold tracking-wide transition-colors ${
              isActive(user && "/home")
                ? "text-yellow-300"
                : "hover:text-yellow-300"
            }`}
          >
            WittyWander
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {navItems.authenticated.map((item) => (
                  <NavLink
                    key={item.to}
                    {...item}
                    isActive={isActive(item.to)}
                  />
                ))}
                <Logout onLogout={logout} />
              </>
            ) : (
              navItems.unauthenticated.map((item) => (
                <NavLink key={item.to} {...item} isActive={isActive(item.to)} />
              ))
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden bg-gray-800 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen py-2" : "max-h-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="px-4 space-y-2">
          {user ? (
            <>
              {navItems.authenticated.map((item) => (
                <MobileNavLink
                  key={item.to}
                  {...item}
                  setIsOpen={setIsOpen}
                  isActive={isActive(item.to)}
                />
              ))}
              <Logout onLogout={logout} isMobile />
            </>
          ) : (
            navItems.unauthenticated.map((item) => (
              <MobileNavLink
                key={item.to}
                {...item}
                setIsOpen={setIsOpen}
                isActive={isActive(item.to)}
                className={item.className}
              />
            ))
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label, isActive, className = "" }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all font-medium ${
        isActive
          ? "bg-indigo-500 text-white"
          : "text-gray-200 hover:bg-indigo-400 hover:text-white"
      } ${className}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({
  to,
  icon,
  label,
  setIsOpen,
  isActive,
  className = "",
}) {
  return (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all font-medium ${
        isActive
          ? "bg-indigo-500 text-white"
          : "text-gray-200 hover:bg-indigo-400 hover:text-white"
      } ${className}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
