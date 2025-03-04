import React, {useEffect} from 'react';
import ReactStars from 'react-rating-stars-component';
import './styles.css';

const Notation = ({ movieId }) => {
    let [rating, setRating] = React.useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/movies/${movieId}`)
            .then((res) => res.json())
            .then((data) => {
                setRating(data.rating);
            });
    }, [movieId]);

    return (
        <div className="notation">
            {rating !== null ? (
                <ReactStars
                    count={5}
                    value={rating}
                    size={30}
                    edit={false}
                    activeColor="#e40813"
                    isHalf={true}
                />
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
};

export default Notation;