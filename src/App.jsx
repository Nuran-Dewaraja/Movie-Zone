import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Page/Home';
import Movies from './components/Page/Movies';
import TvShows from './components/Page/Tv-Shows';
import Anime from './components/Page/Anime';
import ProfilePage from './components/Page/Profile';
import LoginSignupPages from './components/Page/LoginSignupPages';
import ContactPage from './components/Page/ContactPage';

const App = () => {
  const location = useLocation();
  const isAuth = localStorage.getItem('user'); // Check user data in localStorage

  const hideHeaderFooter = location.pathname === '/login';

  const PrivateRoute = ({ element }) => {
    if (isAuth) {
      return element;
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Unauthorized',
        text: 'You must be logged in to access this page.',
        confirmButtonText: 'Go to Login',
      });
      return <Navigate to="/login" />;
    }
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
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profilepage" element={<PrivateRoute element={<ProfilePage />} />} />
        </Routes>
      </main>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default App;




// import React from 'react';
// import { Routes, Route } from 'react-router-dom';

// import Header from './components/Header/Header';
// import Footer from './components/Footer/Footer';
// import Home from './components/Page/Home';
// import Movies from './components/Page/Movies';
// import TvShows from './components/Page/Tv-Shows';
// import Anime from './components/Page/Anime';
// import Playlist from './components/Page/My-List';
// import ProfilePage from './components/Page/Profile';
// import LoginSignupPages from './components/Page/LoginSignupPages';
// import ContactPage from './components/Page/ContactPage';

// const App = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />

//       <main className="flex-1">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<LoginSignupPages />} />
//           <Route path="/movies" element={<Movies />} />
//           <Route path="/tvShows" element={<TvShows />} />
//           <Route path="/anime" element={<Anime />} />
//           <Route path="/playlist" element={<Playlist />} />
//           <Route path="/profilepage" element={<ProfilePage />} />
//           <Route path="/contact" element={<ContactPage />} />
//         </Routes>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default App;
