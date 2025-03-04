import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import movieData from '../../db/efreiflix-db.json';

const VideoPlayer = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const selectedMovie = movieData.movies.find(movie => movie.id === parseInt(id));
    if (selectedMovie) {
      setMovie(selectedMovie);
      setLoading(false);
    } else {
      setError('Movie not found');
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="relative w-full h-screen">
        {movie.trailerUrl ? (
          <iframe
            width="100%"
            height="100%"
            src={movie.trailerUrl}
            title={movie.title}
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        ) : (
          <div className="text-center text-lg text-white">Video not available</div>
        )}
      </div>
    </div>
  );
};


export default VideoPlayer;
