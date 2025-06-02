import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../css/movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovieUrl, setSelectedMovieUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const videoRef = useRef(null);

  const BEARER_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTE3...'; // Truncated

  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/discover/movie', {
      params: {
        include_adult: false,
        include_video: false,
        language: 'en-US',
        page: 1,
        sort_by: 'popularity.desc',
      },
      headers: {
        accept: 'application/json',
        Authorization: BEARER_TOKEN,
      }
    })
    .then((response) => {
      const results = response.data.results.map((movie, index) => ({
        id: movie.id,
        title: movie.title,
        genre: 'N/A',
        year: movie.release_date?.split('-')[0],
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'https://via.placeholder.com/500x750?text=No+Image',
        movieUrl: `/movies/movie${index + 1}.mp4`,
      }));
      setMovies(results);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching movies:', error);
      setLoading(false);
    });
  }, []);

  // Close modal and reset video
  const closePlayer = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setSelectedMovieUrl(null);
    setErrorMsg('');
  };

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closePlayer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check if video exists before setting URL
  const handlePlayMovie = async (url) => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) {
        setSelectedMovieUrl(url);
        setErrorMsg('');
      } else {
        setErrorMsg('Movie file not found.');
      }
    } catch (err) {
      setErrorMsg('Error loading movie.');
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <h2 className="text-3xl font-bold text-white mb-8 text-center mt-12">Popular Movies</h2>

      {loading ? (
        <p className="text-white text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300 shadow-md"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-80 object-cover rounded mb-3"
              />
              <h3 className="text-white text-lg font-semibold">{movie.title}</h3>
              <p className="text-gray-400 text-sm">{movie.genre} • {movie.year}</p>
              <button
                onClick={() => handlePlayMovie(movie.movieUrl)}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Play Movie
              </button>
            </div>
          ))}
        </div>
      )}

      {errorMsg && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {errorMsg}
        </div>
      )}

      {selectedMovieUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-4 rounded-lg max-w-4xl w-full relative">
            <button
              onClick={closePlayer}
              className="absolute top-2 right-3 text-white text-xl"
            >
              ✕
            </button>
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-auto rounded"
            >
              <source src={selectedMovieUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
