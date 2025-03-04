import React, { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';

// const MovieCard = React.lazy(() => import("preview/productPreview"));



const Watchlist = () => {

  const [myfavorites, setMyFavorites] = useState([])
  const [user, setUser] = useState({
    "id":"2",
    "name":"Bob"
  })

  const [myMoviesIds, setMyMoviesIds] = useState([])

  const [myMoviesTitles, setMyMoviesTitles] = useState([]);
  //const myMovies = ["The Matrix", "Inception", "Interstellar"]

  const apiKey = '15d2ea6d0dc1d476efbca3eba2b9bbfb';

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleProductClick = (id) => {
    console.log("ID in handleProductClick:")
    console.log(id)
    setSelectedProduct(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/users?userId=${user.id}&name=${user.name}`
        );
        console.log("Response for user", response.data);

        if (response.data && response.data.length > 0) {
          const watchlist = response.data[0].profiles[0].watchlist;
          console.log("Watchlist IDs:", watchlist);
          setMyMoviesIds(watchlist); 
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [user]); // Only runs when userId changes

  console.log("My movies ids")
  console.log(myMoviesIds)


  useEffect(() => {
    if (myMoviesIds.length === 0) return;

    const fetchMovieTitles = async () => {
      try {
        const movieData = await Promise.all(
          myMoviesIds.map(async (movieId) => {
            const response = await axios.get(
              `http://localhost:3001/movies?id=${movieId}`
            );
            return {
              "id": movieId,
              "title": response.data[0]?.title
            }
          })
        );
        console.log("Fetched Movie Titles:", movieData);
        setMyMoviesTitles(movieData);
      } catch (error) {
        console.error("Error fetching movie titles:", error);
      }
    };
    fetchMovieTitles();
  }, [myMoviesIds]);

  console.log("My movies titles")
  console.log(myMoviesTitles)


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movieData = await Promise.all(
          myMoviesTitles.map(async (movie) => {
            const response = await axios.get(
              `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie.title}`
            );
            const posterPath = response.data.results[0]?.poster_path;
            return {
              id: movie.id,
              title: movie.title, 
              posterUrl: posterPath ? `http://image.tmdb.org/t/p/w500/${posterPath}` : "" 
            };
          })
        );
        setMyFavorites(movieData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies(); // Runs after user data is loaded
  }, [myMoviesTitles]);

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-6">My List</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {myfavorites.map((movie) => (
          <div key={movie.id} className="relative group">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-auto rounded-lg hover:opacity-75 transition-opacity"
              onClick={() => handleProductClick(movie.id)}
            />
            <h2 className="absolute bottom-2 left-2 text-lg font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
              {movie.title}
            </h2>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-2xl mx-auto" onClick={(e) => e.stopPropagation()}>
            <React.Suspense fallback={<div className="text-white text-center p-8">Loading...</div>}>
              <MovieCard id={selectedProduct} />
            </React.Suspense>
            <button
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full z-10"
              onClick={closeModal}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Watchlist;