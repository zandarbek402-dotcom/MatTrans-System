import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { path: '/', label: '📊 Дашборд' },
    { path: '/materials', label: '📦 Материалдар' },
    { path: '/routes', label: '🗺️ Маршруттар' },
    { path: '/transport', label: '🚛 Көлік' },
    { path: '/orders', label: '📋 Тапсырыстар' },
    { path: '/tracking', label: '🎯 Бақылау' },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🚛</span>
          <span className="logo-text">ConMat</span>
        </Link>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={logout} className="btn btn-danger btn-sm">
              🚪 Шығу
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              🔐 Кіру
            </Link>
          )}
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${menuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

