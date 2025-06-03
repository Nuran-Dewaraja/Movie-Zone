import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../css/movies.css';

const Anime = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [trailerLoading, setTrailerLoading] = useState(false);
  const videoRef = useRef(null);

  // ✅ Your Bearer Token
  const BEARER_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTE3YzRmMjFlYzFlNDkzODM4ZDI2NzRiOTkwNTMxOCIsIm5iZiI6MTc0ODg1NDQzOS45MTM5OTk4LCJzdWIiOiI2ODNkNjZhNzBkY2I4NGVhNWM3ZjQxODIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Ir6qHV61F12cWMI_DKnjFmay3L46pUSCfYBAxArczD4';

  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/discover/movie?with_genres=16&language=en-US&page=1', {
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
      const results = response.data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        genre: 'N/A',
        year: movie.release_date?.split('-')[0],
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'https://via.placeholder.com/500x750?text=No+Image',
        overview: movie.overview,
      }));
      setMovies(results);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching movies:', error);
      setErrorMsg('Failed to fetch movies. Check token or network.');
      setLoading(false);
    });
  }, []);

  const closePlayer = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setSelectedMovie(null);
    setErrorMsg('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closePlayer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchTrailer = async (movieId) => {
    try {
      setTrailerLoading(true);
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
        params: {
          language: 'en-US',
        },
        headers: {
          accept: 'application/json',
          Authorization: BEARER_TOKEN,
        }
      });

      const videos = response.data.results;
      const trailer = videos.find(video => 
        video.type === 'Trailer' && 
        video.site === 'YouTube'
      ) || videos.find(video => video.site === 'YouTube');

      if (trailer) {
        return `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
      } else {
        throw new Error('No trailer found');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      throw error;
    } finally {
      setTrailerLoading(false);
    }
  };

  const handlePlayMovie = async (movie) => {
    try {
      setErrorMsg('');
      const trailerUrl = await fetchTrailer(movie.id);
      setSelectedMovie({ ...movie, trailerUrl });
    } catch (error) {
      setErrorMsg('Trailer not available for this movie.');
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <h2 className="text-3xl font-bold text-white mb-8 text-center mt-12">Popular Movies</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
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
                loading="lazy"
              />
              <h3 className="text-white text-lg font-semibold mb-2">{movie.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{movie.genre} • {movie.year}</p>
              <button
                onClick={() => handlePlayMovie(movie)}
                disabled={trailerLoading}
                className="w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {trailerLoading ? 'Loading...' : 'Watch Trailer'}
              </button>
            </div>
          ))}
        </div>
      )}

      {errorMsg && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded shadow-lg z-50">
          {errorMsg}
          <button
            onClick={() => setErrorMsg('')}
            className="ml-4 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}

      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-6xl w-full relative">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-white text-xl font-semibold">{selectedMovie.title}</h3>
              <button
                onClick={closePlayer}
                className="text-white text-2xl hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4">
              {selectedMovie.trailerUrl ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={selectedMovie.trailerUrl}
                    className="w-full h-full rounded"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video w-full bg-gray-800 flex items-center justify-center rounded">
                  <p className="text-white">Loading trailer...</p>
                </div>
              )}
              
              {selectedMovie.overview && (
                <div className="mt-4">
                  <h4 className="text-white font-semibold mb-2">Overview</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedMovie.overview}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Anime;