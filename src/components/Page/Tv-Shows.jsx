import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../css/movies.css';

const TvShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShowUrl, setSelectedShowUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [genreMap, setGenreMap] = useState({});
  const videoRef = useRef(null);

  const BEARER_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTE3YzRmMjFlYzFlNDkzODM4ZDI2NzRiOTkwNTMxOCIsIm5iZiI6MTc0ODg1NDQzOS45MTM5OTk4LCJzdWIiOiI2ODNkNjZhNzBkY2I4NGVhNWM3ZjQxODIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Ir6qHV61F12cWMI_DKnjFmay3L46pUSCfYBAxArczD4';

  // Fetch genres
  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/genre/tv/list', {
      headers: {
        accept: 'application/json',
        Authorization: BEARER_TOKEN,
      }
    }).then((response) => {
      const map = {};
      response.data.genres.forEach(g => {
        map[g.id] = g.name;
      });
      setGenreMap(map);
    });
  }, []);

  // Fetch TV shows
  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/tv/popular', {
      params: {
        language: 'en-US',
        page: 1,
      },
      headers: {
        accept: 'application/json',
        Authorization: BEARER_TOKEN,
      }
    }).then((response) => {
      const shows = response.data.results.map((show, index) => ({
        id: show.id,
        title: show.name,
        year: show.first_air_date?.split('-')[0] || 'N/A',
        genre: show.genre_ids.length ? genreMap[show.genre_ids[0]] || 'N/A' : 'N/A',
        poster: show.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : 'https://via.placeholder.com/500x750?text=No+Image',
        showUrl: `/tv/tv${index + 1}.mp4`,
      }));
      setTvShows(shows);
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching TV shows:', error);
      setLoading(false);
    });
  }, [genreMap]);

  const closePlayer = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setSelectedShowUrl(null);
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

  const handlePlayShow = async (url) => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) {
        setSelectedShowUrl(url);
        setErrorMsg('');
      } else {
        setErrorMsg('TV show file not found.');
      }
    } catch (err) {
      setErrorMsg('Error loading TV show.');
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <h2 className="text-3xl font-bold text-white mb-8 text-center mt-12">Popular TV Shows</h2>

      {loading ? (
        <p className="text-white text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {tvShows.map((show) => (
            <div
              key={show.id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300 shadow-md"
            >
              <img
                src={show.poster}
                alt={show.title}
                className="w-full h-80 object-cover rounded mb-3"
              />
              <h3 className="text-white text-lg font-semibold">{show.title}</h3>
              <p className="text-gray-400 text-sm">{show.genre} • {show.year}</p>
              <button
                onClick={() => handlePlayShow(show.showUrl)}
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Play Show
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

      {selectedShowUrl && (
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
              <source src={selectedShowUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default TvShows;
