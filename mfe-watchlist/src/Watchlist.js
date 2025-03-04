import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';

const Watchlist = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moviesWithPosters, setMoviesWithPosters] = useState([]);
  const [userId, setUserId] = useState(null);
  const [profileId, setProfileId] = useState(null);


  const getUserFromLocalStorage = () => {
    const userLocalStorage = localStorage.getItem('user');
    if (!userLocalStorage) {
      console.error('Aucun utilisateur trouvé.');
      return null;
    }
    const userData = JSON.parse(userLocalStorage);
    return { userId: userData.id, profileId: userData.profileId };
  };


  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (userData) {
      setUserId(userData.userId);
      setProfileId(userData.profileId);
    }
  }, []);


  useEffect(() => {
    if (!userId || !profileId) return;
    const fetchData = async () => {
      try {
        const userLocalStorage = localStorage.getItem('user');
        if (!userLocalStorage) {
          console.error('Aucun utilisateur trouvé.');
          return;
        }
        const userId = JSON.parse(userLocalStorage).id;
        const profileId = JSON.parse(userLocalStorage).profileId;

        console.log('Fetching data for user ID:', userId);
        const userResponse = await fetch(`http://localhost:3001/users/?id=${userId}`);
        const user = await userResponse.json();

        // on cherche le profil donc userId et profileId
        const profile = user[0].profiles.filter(profile => profile.id.toString() === profileId.toString());
        setProfileData(profile[0]);

      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, profileId]);


  useEffect(() => {
    if (profileData) {
      fetchPostersForMovies();
    }
  }, [profileData]);

  const fetchPostersForMovies = async () => {
    const apiKey = '15d2ea6d0dc1d476efbca3eba2b9bbfb';

    // On récupère les films à partir de la BDD
    const watchlistMovies = profileData.watchlist ?? [];
    const favoriteMovies = profileData.favorites ?? [];
    const allMoviesToFetch = [...watchlistMovies, ...favoriteMovies];

    // on récupère les posters des films
    const moviePromises = allMoviesToFetch.map(async (movieId) => {
      // on récupère le film depuis la BDD
      const filmBDD = await fetch(`http://localhost:3001/movies/?id=${movieId}`);
      const film = await filmBDD.json();

      // on recupère juste le poster du film
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${film[0].title}`);
      const posterPath = response.data.results[0]?.poster_path;

      return {
        id: movieId,
        title: film[0].title,
        posterUrl: posterPath ? `http://image.tmdb.org/t/p/w500/${posterPath}` : film[0].posterUrl, // Si le poster existe dans TMDb, on l'utilise, sinon on prend celui de la BDD
        year: film[0].year || 'Unknown',
        trailerUrl: film[0].trailerUrl
      };
    });

    // on attend que tous les films soient récupérés
    const moviesWithPosters = await Promise.all(moviePromises);
    setMoviesWithPosters(moviesWithPosters);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>Aucun utilisateur trouvé.</div>;
  }

  // on recup les films à afficher
  const watchlistMovies = moviesWithPosters.filter(movie => profileData.watchlist.includes(movie.id));
  const favoriteMovies = moviesWithPosters.filter(movie => profileData.favorites.includes(movie.id));

  const handleClick = async (movieId) => {
    // TODO: Implementer la redirection vers la page du film
    console.log('Click on movie', movieId);
  };


  return (
    <div className="container mx-auto p-4">
      <div className="bg-transparent rounded-lg p-6 mb-6">
        <h2 className="text-white text-xl font-semibold mb-4">Films à Voir</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watchlistMovies.length > 0 ? (
            watchlistMovies.map((movie) => (
              <div
              key={movie.id}
              onClick={() => handleClick(movie.id)}
              className="movie-card bg-gray-900 text-white p-2 rounded-lg overflow-hidden relative cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg">
                <img src={movie.posterUrl} alt={movie.title} className="w-full aspect-2/3 object-cover rounded-lg" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black p-3">
                  <h3 className="text-lg font-bold truncate">{movie.title}</h3>
                  <p className="text-sm opacity-75">{movie.year}</p>
                  <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm mt-1 inline-block">
                    Voir la bande-annonce
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Aucun film à voir pour le moment.</p>
          )}
        </div>
      </div>

      <div className="bg-transparent rounded-lg p-6">
        <h2 className="text-white text-xl font-semibold mb-4">Films Aimés</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favoriteMovies.length > 0 ? (
            favoriteMovies.map((movie) => (
              <div
              key={movie.id}
              onClick={() => handleClick(movie.id)}
              className="movie-card bg-gray-900 text-white p-2 rounded-lg overflow-hidden relative cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg">
                <img src={movie.posterUrl} alt={movie.title} className="w-full aspect-2/3 object-cover rounded-lg" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black p-3">
                  <h3 className="text-lg font-bold truncate">{movie.title}</h3>
                  <p className="text-sm opacity-75">{movie.year}</p>
                  <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm mt-1 inline-block">
                    Voir la bande-annonce
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Aucun film aimé pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;

