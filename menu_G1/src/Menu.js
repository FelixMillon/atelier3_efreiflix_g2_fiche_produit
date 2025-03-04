import React, { useState, useEffect } from "react";
import axios from "axios";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState([]);

  const getUniqueGenres = (movies) => {
    const genreSet = new Set();
    movies.forEach((movie) => {
      movie.genres.forEach((genre) => genreSet.add(genre));
    });
    return Array.from(genreSet);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/movies")
      .then((response) => {
        const movies = response.data;
        const uniqueGenres = getUniqueGenres(movies);
        setGenres(uniqueGenres);
      })
      .catch((error) => console.error("Erreur lors de la récupération des films :", error));
  }, []);

  const handleGenreClick = (genre) => {
    console.log(`Genre cliqué : ${genre}`);
    // Ajoutez ici la logique que vous souhaitez exécuter lorsqu'un genre est cliqué
  };

  return (
    <div className="relative">
      <button
        className="fixed top-5 left-5 text-white bg-gray-900 p-2 rounded-md focus:outline-none z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)}></div>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {isOpen && (
          <div id="mega-menu" className="p-5">
            <h2 className="text-lg font-bold text-gray-400 mb-4">Your Top Categories</h2>
            <div className="space-y-3">
              {genres.length > 0 ? (
                genres.map((genre, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:text-red-500 transition duration-200 pb-4"
                    onClick={() => handleGenreClick(genre)}
                    style={{ cursor: 'pointer' }}
                  >
                    {genre}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Chargement...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
