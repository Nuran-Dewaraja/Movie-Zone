import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/movies.css'; // optional styling

const Anime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/anime')
      .then((res) => {
        setAnimeList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching anime:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black p-6">
      <h2 className="text-3xl font-bold text-white mb-8 text-center mt-12">Popular Anime</h2>

      {loading ? (
        <p className="text-white text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {animeList.map((anime) => (
            <div
              key={anime.id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300 shadow-md"
            >
              <img
                src={anime.poster}
                alt={anime.title}
                className="w-full h-80 object-cover rounded mb-3"
              />
              <h3 className="text-white text-lg font-semibold">{anime.title}</h3>
              <p className="text-gray-400 text-sm">{anime.genre} • {anime.year}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Anime;
