import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Ensure axios is installed: npm install axios
import '../css/movies.css'; // Use same styles for consistency

const TvShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/discover/tv', {
      params: {
        include_adult: false,
        include_null_first_air_dates: false,
        language: 'en-US',
        page: 1,
        sort_by: 'popularity.desc',
      },
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOTE3YzRmMjFlYzFlNDkzODM4ZDI2NzRiOTkwNTMxOCIsIm5iZiI6MTc0ODg1NDQzOS45MTM5OTk4LCJzdWIiOiI2ODNkNjZhNzBkY2I4NGVhNWM3ZjQxODIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Ir6qHV61F12cWMI_DKnjFmay3L46pUSCfYBAxArczD4'
      }
    })
      .then((response) => {
        const shows = response.data.results.map((show) => ({
          id: show.id,
          title: show.name,
          year: show.first_air_date?.split('-')[0],
          genre: 'N/A', // Optional: fetch genre names using genre API
          poster: show.poster_path
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image'
        }));
        setTvShows(shows);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching TV shows:', error);
        setLoading(false);
      });
  }, []);

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TvShows;
