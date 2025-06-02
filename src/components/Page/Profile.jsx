import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/user/profile')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-white text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-6">
      <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
        <div className="flex flex-col items-center gap-4">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/150'}
            alt={`${user.name}'s avatar`}
            className="w-32 h-32 rounded-full object-cover"
          />
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
          <p className="text-gray-400">Lecturer ID: {user.lecturerId || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
