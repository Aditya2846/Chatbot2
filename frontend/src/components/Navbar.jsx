import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl">🏛️</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-500 transition-all">
              National Museum
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
            <Link to="/exhibitions" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Exhibitions</Link>
            <Link to="/tickets" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">My Tickets</Link>

            {token ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-blue-600/30 transition-all duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-xl">
            <Link to="/" className="block text-gray-600 hover:text-blue-600 font-medium" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/exhibitions" className="block text-gray-600 hover:text-blue-600 font-medium" onClick={() => setIsOpen(false)}>Exhibitions</Link>
            {token ? (
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="w-full text-left text-red-600 font-semibold"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block text-gray-600 hover:text-blue-600 font-medium" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="block text-blue-600 font-semibold" onClick={() => setIsOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
