import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Top Up', path: '/topup' },
    { name: 'Transaction', path: '/transaction' },
    { name: 'Akun', path: '/akun' },
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-5 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/home" className="flex items-center gap-3 group">
          <img src="/assets/Logo.png" alt="Logo" className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold tracking-tight text-[#333333]">SIMS PPOB</span>
        </Link>

        {/* DESKTOP NAVIGASI LINK*/}
        <div className="hidden md:flex items-center gap-12 font-semibold">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#f42619] after:transition-all after:duration-300 ${isActive ? "text-[#f42619] after:w-full" : "text-[#555555] hover:text-[#f42619] after:w-0 hover:after:w-full"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* BURGER MENU UNTUK MOBILE */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-[#333333] hover:text-[#f42619] focus:outline-none transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGASI MENU */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xl transition-all duration-300 ease-out z-40 ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
          }`}
      >
        <div className="flex flex-col p-6 gap-2 font-semibold">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? "bg-[#f42619]/10 text-[#f42619]" : "text-[#555555] hover:bg-gray-50 hover:text-[#f42619]"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>

  );
};

export default Navbar;

