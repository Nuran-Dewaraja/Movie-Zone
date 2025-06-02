import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Playlist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch playlist items from API
  useEffect(() => {
    axios.get('http://localhost:5000/api/playlist')
      .then(res => {
        setPlaylist(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load playlist:', err);
        setLoading(false);
      });
  }, []);

  // Remove item from playlist
  const removeItem = (id) => {
    axios.delete(`http://localhost:5000/api/playlist/${id}`)
      .then(() => {
        setPlaylist(prev => prev.filter(item => item.id !== id));
      })
      .catch(err => {
        console.error('Failed to remove item:', err);
      });
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <h2 className="text-3xl font-bold text-white mb-8 text-center mt-12">My Playlist</h2>

      {loading ? (
        <p className="text-white text-center">Loading playlist...</p>
      ) : playlist.length === 0 ? (
        <p className="text-gray-400 text-center">Your playlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlist.map(item => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-300 shadow-md"
            >
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-60 object-cover rounded mb-3"
              />
              <h3 className="text-white text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{item.genre} • {item.year}</p>
              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;
