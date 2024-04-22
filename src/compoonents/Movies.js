import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar, faStarHalfAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Movies.css'

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:4001";
    const [showDialogueBox,setShowDialogueBox] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/public/movies`);
            setMovies(response.data.movies);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    // const handleRating = async (movieId, rating) => {
    //     try {
    //         console.log(rating)
    //         const updatedMovies = movies.map((movie) => {
    //             if (movie.id === movieId) {
    //                 return { ...movie, userRating: rating };
    //             }
    //             return movie;
    //         });
    //         setMovies(updatedMovies);
    //     } catch (error) {
    //         console.error('Error rating movie:', error);
    //     }
    // };
    const isLoggedIn = true
const handleRating = async() => {
    
    setShowDialogueBox(true)
}
const handleLogin = () => {
    navigate('/login');
    setShowDialogueBox(false)
}
const handleCancel = () => {
    setShowDialogueBox(false)
}
    return (
        <div>
            <header className="bg-gray-800 text-white py-4">
                <div className="text-4xl font-bold text-center">Movies</div>
            </header>
            {movies.map((movie) => (
                <div key={movie.id} className="mb-8">
                    <div className="flex justify-around items-center mb-2">
                        <h3 className="text-xl font-semibold mr-4">{movie.title}</h3>
                        <img src={movie.poster_url} alt={movie.title} width="250" height="200" />
                        <div className="flex items-center">
                            <div className="text-yellow-500 mr-2">
                                {
                                    movie.rating && [...Array(Math.floor(movie.rating))].map((_, index) => (
                                        <FontAwesomeIcon key={index} icon={farStar} />
                                    ))}
                                {movie.rating && movie.rating % 1 !== 0 && <FontAwesomeIcon icon={faStarHalfAlt} />}
                                {!movie.rating && "No ratings"}
                            </div>
                            <span >{movie.rating || "Not Rated"}</span>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-4">{movie.description}</p>
                    <div>
                        {[...Array(5)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleRating(movie.id, index + 1)}
                                style={{ color: index < movie.userRating ? '#FFC120' : '#A0AEC0' }} // Yellow or gray color
                                className="focus:outline-none inline-block"
                            >
                                {index < movie.userRating ? <FontAwesomeIcon icon={fasStar} /> : (index + 0.5 === movie.userRating ? <FontAwesomeIcon icon={faStarHalfAlt} /> : <FontAwesomeIcon icon={farStar} />)}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            {showDialogueBox && (
                <div className="modal-overlay">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title">Login Required</h2>
                            </div>
                            <div className="modal-body">
                                <p>You need to login to rate the movie</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Movies;