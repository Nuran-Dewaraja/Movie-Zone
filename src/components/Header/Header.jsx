import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize darkMode state from localStorage or default to true
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === null ? true : saved === 'true';
  });

  // Sync dark mode class on html and save preference
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <nav className="bg-white dark:bg-gray-900 dark:text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand */}
        <div className="text-2xl font-bold text-orange-500">
          <a href="/">🎬 MovieZone</a>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8 text-lg">
          <a href="/" className="hover:text-green-500 transition-colors duration-200">
            Home
          </a>
          <a href="/movies" className="hover:text-green-500 transition-colors duration-200">
            Movies
          </a>
          <a href="/tvShows" className="hover:text-green-500 transition-colors duration-200">
            Tv Shows
          </a>
          <a href="/anime" className="hover:text-green-500 transition-colors duration-200">
            Anime
          </a>
          <a href="/contact" className="hover:text-green-500 transition-colors duration-200">
            Contact
          </a>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded hover:opacity-80"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Login Button */}
          <a
            href="/login"
            className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700"
          >
            Login
          </a>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-xl">
            {isOpen ? '✖' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 text-lg">
          <a href="/" onClick={() => setIsOpen(false)} className="block hover:text-green-500">
            Home
          </a>
          <a href="/movies" onClick={() => setIsOpen(false)} className="block hover:text-green-500">
            Movies
          </a>
          <a href="/tvShows" onClick={() => setIsOpen(false)} className="block hover:text-green-500">
            Tv Shows
          </a>
          <a href="/anime" onClick={() => setIsOpen(false)} className="block hover:text-green-500">
            Anime
          </a>
          <a href="/contact" onClick={() => setIsOpen(false)} className="block hover:text-green-500">
            Contact
          </a>

          <button
            onClick={() => {
              setDarkMode(!darkMode);
              setIsOpen(false);
            }}
            className="block bg-gray-300 dark:bg-gray-700 dark:text-white px-3 py-2 rounded hover:opacity-80"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <a
            href="/login"
            onClick={() => setIsOpen(false)}
            className="block bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700"
          >
            Login
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
