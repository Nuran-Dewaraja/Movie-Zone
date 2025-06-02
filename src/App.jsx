import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Page/Home';
import Movies from './components/Page/Movies';
import TvShows from './components/Page/Tv-Shows';
import Anime from './components/Page/Anime';
import Playlist from './components/Page/My-List';
import ProfilePage from './components/Page/Profile';
import LoginSignupPages from './components/Page/LoginSignupPages';

const App = () => {
  const location = useLocation();
  const isAuth = localStorage.getItem('isLoggedIn') === 'true';

  // Hide header and footer on login/signup pages
  const hideHeaderFooter = location.pathname === '/login';

  // Wrapper for protected routes
  const PrivateRoute = ({ element }) => {
    return isAuth ? element : <Navigate to="/login" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderFooter && <Header />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignupPages />} />

          {/* Protected Routes */}
          <Route path="/movies" element={<PrivateRoute element={<Movies />} />} />
          <Route path="/tvshows" element={<PrivateRoute element={<TvShows />} />} />
          <Route path="/anime" element={<PrivateRoute element={<Anime />} />} />
          <Route path="/playlist" element={<PrivateRoute element={<Playlist />} />} />
          <Route path="/profilepage" element={<PrivateRoute element={<ProfilePage />} />} />
        </Routes>
      </main>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default App;
