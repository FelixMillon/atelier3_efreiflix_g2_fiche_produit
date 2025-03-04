import React, { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';


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
            return response.data[0]?.title;
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
          myMoviesTitles.map(async (title) => {
            const response = await axios.get(
              `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}`
            );
            const posterPath = response.data.results[0]?.poster_path;
            return { 
              title: title, 
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
        {myfavorites.map((movie, index) => (
          <div key={index} className="relative group">
            <img
              src={`${movie.posterUrl}`}
              alt={movie.title}
              className="w-full h-auto rounded-lg hover:opacity-75 transition-opacity"
            />
            <h2 className="absolute bottom-2 left-2 text-lg font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
              {movie.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;