import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MovieCard = React.lazy(() => import("preview/productPreview"));
const Recommendations = ({ movieId = 1, movies = [], recommendations = [] }) => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const recommendedMovieIds =
    recommendations.find((rec) => rec.movieId === movieId)?.recommendedMovieIds || [];
  const recommendedMovies = movies.filter((movie) => recommendedMovieIds.includes(movie.id));
  const apiKey = "15d2ea6d0dc1d476efbca3eba2b9bbfb";

  const openModal = (id) => {
    setSelectedMovieId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovieId(null);
    setIsModalOpen(false);
  };
  
  const defaultMovies = [
    { id: 1, title: "Inception" },
    { id: 2, title: "The Dark Knight" },
    { id: 3, title: "Interstellar" },
    { id: 4, title: "The Matrix" },
    { id: 5, title: "Pulp Fiction" }
  ];

  const moviesToDisplay = recommendedMovies.length > 0 ? recommendedMovies : defaultMovies;
  const currentMovie = movies.find((m) => m.id === movieId);

  const MovieList = ({ movies, currentMovieId = movieId, onMovieClick }) => {
    const [posterUrls, setPosterUrls] = useState({});
    const containerRef = useRef(null);

    useEffect(() => {
      const fetchPosters = async () => {
        const moviePromises = movies.map(async (movie) => {
          try {
            const response = await axios.get(
              `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movie.title)}`
            );
            const posterPath = response.data.results[0]?.poster_path;
            return { id: movie.id, posterUrl: posterPath ? `http://image.tmdb.org/t/p/w500/${posterPath}` : null };
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'affiche pour ${movie.title}:`, error);
            return { id: movie.id, posterUrl: null };
          }
        });

        const resolvedPosters = await Promise.all(moviePromises);
        setPosterUrls(
          resolvedPosters.reduce((acc, movie) => {
            acc[movie.id] = movie.posterUrl;
            return acc;
          }, {})
        );
      };

      fetchPosters();
    }, [movies]);

    const scrollLeft = () => {
      if (containerRef.current) {
        containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
      }
    };

    const scrollRight = () => {
      if (containerRef.current) {
        containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    };

    return (
      <div className="relative bg-gradient-to-b from-gray-900 to-black text-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-6 border-l-4 border-red-600 pl-4">
          Recommandations {currentMovie ? `pour ${currentMovie.title}` : "pour vous"}
        </h2>

        {/* Flèche gauche */}
        {movies.length > 2 && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
          >
            <FaChevronLeft size={24} />
          </button>
        )}

        {/* Liste des films */}
        <div ref={containerRef} className="flex space-x-6 overflow-hidden py-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onMovieClick(movie.id)}
              className="relative min-w-[200px] max-w-[200px] cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
            >
              {posterUrls[movie.id] ? (
                <img
                  src={posterUrls[movie.id]}
                  alt={movie.title}
                  className="rounded-lg shadow-md transition-opacity duration-500 hover:opacity-80"
                />
              ) : (
                <div className="w-[200px] h-[300px] bg-gray-800 flex items-center justify-center text-gray-500">
                  Image non disponible
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 rounded-b-lg">
                <h3 className="text-white font-semibold truncate">{movie.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Flèche droite */}
        {movies.length > 2 && (
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
          >
            <FaChevronRight size={24} />
          </button>
        )}
        
      </div>
    );
  };
  return  (
    <>
      <MovieList movies={moviesToDisplay} currentMovieId={movieId} onMovieClick={openModal} />
      
      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative w-full max-w-2xl mx-auto" onClick={(e) => e.stopPropagation()}>
            <React.Suspense fallback={<div className="text-white text-center p-8">Chargement...</div>}>
              <MovieCard id={selectedMovieId} />
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
    </>
  );
};

export default Recommendations;
