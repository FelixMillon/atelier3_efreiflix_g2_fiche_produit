import React, { useEffect, useState } from "react";
import './styles.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer un utilisateur et ses profils en fonction de l'ID de l'utilisateur
  const fetchUserById = (userId) => {
    const response = fetch(`http://localhost:3001/users/?id=${userId}`)
      .then((response) => response.json())
      .catch((err) => {
        throw new Error("Erreur lors de la récupération de l'utilisateur");
      });
    return response;
  };

  useEffect(() => {
    // Paramètres en dur : Utilisateur avec ID 1
    const userId = 1; // ID de l'utilisateur

    fetchUserById(userId)
      .then((userData) => {
        const data = userData[0];
        console.log(data);
        setUser(data); // On met à jour l'état avec l'utilisateur récupéré
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return null;

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      {/* Informations générales du compte */}
      <div className="flex flex-col items-center bg-gray-800 bg-opacity-75 p-6 rounded-lg mb-8">
        <h2 className="text-3xl font-bold text-white">{user.name}</h2>
        <p className="text-sm text-gray-300 mt-2">{user.bio}</p>
        <p className="text-sm text-gray-400 mt-2">Email: {user.email || "Non fourni"}</p>
      </div>

      {/* Liste des profils */}
      <div className="space-y-8">
        <h3 className="text-2xl font-semibold text-white border-l-4 border-red-600 pl-4 mb-4">Profils</h3>
        <div className="flex flex-wrap gap-6">
          {user.profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-gray-800 bg-opacity-75 rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow transform duration-300"
            >
              <div className="flex flex-col items-center mb-6">
                <img
                  className="w-32 h-32 rounded-full border-4 border-gray-500 mb-4"
                  src={profile.avatar}
                  alt={`${profile.name} Avatar`}
                />
                <h4 className="text-lg font-semibold text-white">{profile.name}</h4>
                {profile.child && (
                  <span className="text-sm text-gray-400 mt-1">(Profil enfant)</span>
                )}
              </div>
              <div className="text-sm text-gray-300 space-y-2">
                <p>Email: {profile.email || "Non fourni"}</p>
                <p>Langue: {profile.lang.toUpperCase()}</p>
                <p>Favoris: {profile.favorites.length}</p>
                <p>Watchlist: {profile.watchlist.length}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
