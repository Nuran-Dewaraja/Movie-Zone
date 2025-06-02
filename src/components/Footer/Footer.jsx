import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Cineverse</h4>
          <p className="text-gray-400">Your gateway to endless entertainment.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Browse</h4>
          <ul className="space-y-1 text-gray-400">
            <li><a href="#">Movies</a></li>
            <li><a href="#">TV Shows</a></li>
            <li><a href="#">Trending</a></li>
            <li><a href="#">New Releases</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <ul className="space-y-1 text-gray-400">
            <li><a href="#">About</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Press</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-gray-400">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-500 text-xs">
        &copy; 2025 Cineverse. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
