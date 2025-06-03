import React, { useRef, useState, useEffect } from 'react';
import background1 from '../../assets/background1.png';
import axios from 'axios';
import '../../index.css';

const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTE3YzRmMjFlYzFlNDkzODM4ZDI2NzRiOTkwNTMxOCIsIm5iZiI6MTc0ODg1NDQzOS45MTM5OTk4LCJzdWIiOiI2ODNkNjZhNzBkY2I4NGVhNWM3ZjQxODIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Ir6qHV61F12cWMI_DKnjFmay3L46pUSCfYBAxArczD4';

const ScrollSection = ({ title, type, items, scrollRef, hoveredSection, setHoveredSection }) => {
  const [autoScrollDirection, setAutoScrollDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll functionality
  useEffect(() => {
    if (!scrollRef.current || isPaused || items.length === 0) return;

    const scrollContainer = scrollRef.current;
    const scrollAmount = 2; // Pixels per scroll
    const scrollDelay = 50; // Milliseconds between scrolls

    const autoScroll = () => {
      if (!scrollContainer) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const maxScroll = scrollWidth - clientWidth;

      if (scrollLeft >= maxScroll && autoScrollDirection === 1) {
        setAutoScrollDirection(-1);
      } else if (scrollLeft <= 0 && autoScrollDirection === -1) {
        setAutoScrollDirection(1);
      }

      scrollContainer.scrollLeft += scrollAmount * autoScrollDirection;
    };

    const interval = setInterval(autoScroll, scrollDelay);
    return () => clearInterval(interval);
  }, [autoScrollDirection, isPaused, items.length]);

  const scroll = (ref, direction) => {
    const amount = 300;
    ref.current?.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const handleMouseEnter = () => {
    setHoveredSection(type);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setHoveredSection(null);
    setIsPaused(false);
  };

  return (
    <div className="p-6 bg-black">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Auto-scrolling</span>
          <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
        </div>
      </div>
      
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth"
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <div className="flex gap-4">
            {items.length === 0 ? (
              <div className="flex items-center justify-center w-full h-64">
                <p className="text-gray-400 text-lg">Loading {title}...</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 hover:scale-105 transition-all duration-300 cursor-pointer flex-shrink-0 w-64 shadow-md"
                >
                  <img
                    src={item.poster || 'https://via.placeholder.com/256x192?text=No+Image'}
                    alt={item.title}
                    className="h-48 w-full object-cover rounded mb-3"
                    loading="lazy"
                  />
                  <h3 className="text-white text-lg font-semibold truncate">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.year} • {item.genre || item.type}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {hoveredSection === type && (
          <>
            <button
              aria-label={`Scroll ${type} left`}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white p-3 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full z-10 transition-all duration-200"
              onClick={() => scroll(scrollRef, 'left')}
            >
              ◀
            </button>
            <button
              aria-label={`Scroll ${type} right`}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-3 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full z-10 transition-all duration-200"
              onClick={() => scroll(scrollRef, 'right')}
            >
              ▶
            </button>
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              Hover to pause auto-scroll
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const FeaturedMovie = () => {
  const tvScrollRef = useRef(null);
  const movieScrollRef = useRef(null);
  const animeMoviesScrollRef = useRef(null);
  const animeTvScrollRef = useRef(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [userRating, setUserRating] = useState(8.7);
  const [error, setError] = useState(null);

  // State for each section data
  const [tvShows, setTvShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [animeMovies, setAnimeMovies] = useState([]);
  const [animeTvShows, setAnimeTvShows] = useState([]);

  useEffect(() => {
    // Fetch Popular TV Shows from TMDB
    axios.get('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', {
      headers: {
        Authorization: AUTH_TOKEN,
        Accept: 'application/json',
      },
    })
    .then(response => {
      // Map TMDB data to your item shape with poster, title, year, genre/type
      const mappedTvShows = response.data.results.map(show => ({
        id: show.id,
        title: show.title || show.name,
        year: show.release_date ? show.release_date.slice(0, 4) : 
              show.first_air_date ? show.first_air_date.slice(0, 4) : 'N/A',
        poster: show.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : null,
        genre: 'Upcoming',
        type: 'movie',
      }));
      setTvShows(mappedTvShows);
    })
    .catch(err => {
      setError('Failed to fetch upcoming movies');
      console.error(err);
    });

    // Fetch Popular Movies
    axios.get('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
      headers: {
        Authorization: AUTH_TOKEN,
        Accept: 'application/json',
      },
    })
    .then(response => {
      const mappedMovies = response.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date ? movie.release_date.slice(0, 4) : 'N/A',
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        genre: 'Popular',
        type: 'movie',
      }));
      setMovies(mappedMovies);
    })
    .catch(err => {
      console.error('Failed to fetch popular movies:', err);
      setMovies([]);
    });

    // Fetch Anime Movies (using discover with anime genre)
    axios.get('https://api.themoviedb.org/3/discover/movie?with_genres=16&language=en-US&page=1', {
      headers: {
        Authorization: AUTH_TOKEN,
        Accept: 'application/json',
      },
    })
    .then(response => {
      const mappedAnimeMovies = response.data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date ? movie.release_date.slice(0, 4) : 'N/A',
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        genre: 'Animation',
        type: 'anime-movie',
      }));
      setAnimeMovies(mappedAnimeMovies);
    })
    .catch(err => {
      console.error('Failed to fetch anime movies:', err);
      setAnimeMovies([]);
    });

    // Fetch Popular TV Shows
    axios.get('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1', {
      headers: {
        Authorization: AUTH_TOKEN,
        Accept: 'application/json',
      },
    })
    .then(response => {
      const mappedAnimeTvShows = response.data.results.map(show => ({
        id: show.id,
        title: show.name,
        year: show.first_air_date ? show.first_air_date.slice(0, 4) : 'N/A',
        poster: show.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : null,
        genre: 'TV Series',
        type: 'tv-show',
      }));
      setAnimeTvShows(mappedAnimeTvShows);
    })
    .catch(err => {
      console.error('Failed to fetch TV shows:', err);
      setAnimeTvShows([]);
    });
  }, []);

  const handleStarClick = (index) => {
    setUserRating(index * 2);
  };

  const renderStars = () => {
    const fullStars = Math.floor(userRating / 2);
    const halfStar = userRating % 2 >= 1;
    const totalStars = 5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(totalStars)].map((_, i) => {
          if (i < fullStars) {
            return (
              <span
                key={i}
                className="text-yellow-400 cursor-pointer text-xl hover:scale-110 transition-transform"
                onClick={() => handleStarClick(i + 1)}
              >
                ★
              </span>
            );
          } else if (i === fullStars && halfStar) {
            return (
              <span
                key={i}
                className="text-yellow-400 cursor-pointer text-xl hover:scale-110 transition-transform"
                onClick={() => handleStarClick(i + 1)}
              >
                ☆
              </span>
            );
          } else {
            return (
              <span
                key={i}
                className="text-gray-500 cursor-pointer text-xl hover:scale-110 transition-transform"
                onClick={() => handleStarClick(i + 1)}
              >
                ☆
              </span>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div>
      <section className="relative min-h-screen w-full bg-black text-white flex items-center justify-center p-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${background1})`,
            filter: 'blur(8px)',
            zIndex: 0,
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-65 z-10"></div>

        <div className="relative z-20 max-w-xl animate-fade-up">
          <div className="inline-block text-orange-600 px-3 py-1 text-sm mb-4 animate-delay-1">
            <span className="mr-2">🎥</span>FEATURED MOVIE
          </div>
          <h1 className="text-6xl font-bold text-orange-600 mb-4 animate-delay-2">
            THE MATRIX
          </h1>
          <p className="text-lg leading-relaxed mb-6 animate-delay-3">
            A computer programmer discovers that reality as he knows it doesn't exist.
            Join Neo on his journey down the rabbit hole in this groundbreaking sci-fi thriller.
          </p>
          <div className="flex gap-4 mb-6 animate-delay-4">
            <button className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:shadow-orange-lg transition hover:scale-105">
              ▶ WATCH NOW
            </button>
            <button className="bg-gray-700 text-white px-6 py-3 rounded-xl hover:shadow-md transition hover:scale-105">
              MORE INFO
            </button>
          </div>
          <div className="text-sm text-gray-400 animate-delay-5 mb-2">
            <span>1999</span> • <span>2H 16M</span> • <span>SCI-FI, ACTION</span> •{' '}
            <span className="text-yellow-400">★ {userRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2 animate-delay-5">
            <span className="text-white text-sm">Your Rating:</span>
            {renderStars()}
          </div>
        </div>
      </section>

      <ScrollSection
        title="Upcoming Movies"
        type="upcoming"
        scrollRef={tvScrollRef}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
        items={tvShows}
      />

      <ScrollSection
        title="Popular Movies"
        type="movie"
        scrollRef={movieScrollRef}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
        items={movies}
      />

      <ScrollSection
        title="Popular Anime Movies"
        type="anime-movie"
        scrollRef={animeMoviesScrollRef}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
        items={animeMovies}
      />

      <ScrollSection
        title="Popular TV Shows"
        type="anime-tv"
        scrollRef={animeTvScrollRef}
        hoveredSection={hoveredSection}
        setHoveredSection={setHoveredSection}
        items={animeTvShows}
      />

      {error && (
        <div className="bg-red-600 text-white p-4 m-6 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default FeaturedMovie;