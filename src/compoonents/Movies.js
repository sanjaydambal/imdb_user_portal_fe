import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar, faStarHalfAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Movies.css'

const Movies = ({ isLoggedIn}) => {
    const [movies, setMovies] = useState([]);
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:4001";
    const [showDialogueBox, setShowDialogueBox] = useState(false);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const [userRatings, setUserRatings] = useState({}); 
    useEffect(() => {
        fetchMovies();
        if (isLoggedIn) {
            fetchUserRating();
        }
    }, [isLoggedIn]);

    const fetchMovies = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/public/movies`);
            setMovies(response.data.movies);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const fetchUserRating = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            const response = await axios.get(`${apiUrl}/api/user/${userId}/ratings`, { headers: { Authorization: `Bearer ${token}` } });
            setUserRatings(response.data.ratings);
        } catch (err) {
            console.error('Error getting rating', err);
        }
    };

    const handleRating = async (movieId, ratingValue) => {
        if (!isLoggedIn) {
            setShowDialogueBox(true);
            return;
        }
    
        try {
            const response = await axios.post(
                `${apiUrl}/api/movies/${movieId}/rating`,
                { rating: ratingValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.data.success) {
                fetchMovies();
                fetchUserRating();
            } else {
                console.error('Error adding rating:', response.data.error);
            }
        } catch (error) {
            console.error('Error adding rating:', error);
        }
    };
    
    

    const handleLogin = () => {
        navigate('/login');
        setShowDialogueBox(false);
    };

    const handleCancel = () => {
        setShowDialogueBox(false);
    };
    const handleMovieDetails = () => {
        navigate('/movies/${movieId}')
    }
    return (
        <div>
            <header className="bg-gray-800 text-white py-4">
                <div className="text-4xl font-bold text-center">Movies</div>
            </header>
            {movies.map((movie) => (
                <div key={movie.id} className="mb-8" onClick={()=> handleMovieDetails} style={{cursor:'pointer'}}>
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
                    <span>{token ? "Your Rating / " : ""} Rate Movie : </span>{[...Array(5)].map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRating(movie.id, index + 1);
                                }}
                               
                                className="focus:outline-none inline-block"
                            >
                               {index < (userRatings[movie.id] || 0) ? <FontAwesomeIcon icon={fasStar} className="text-yellow-500" /> : (index + 0.5 === userRatings[movie.id] ? <FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-500" /> : <FontAwesomeIcon icon={farStar} className="text-yellow-500" />)}
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