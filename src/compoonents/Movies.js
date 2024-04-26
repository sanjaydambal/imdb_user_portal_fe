import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar, faStarHalfAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';

const Movies = ({ isLoggedIn }) => {
    const [movies, setMovies] = useState([]);
    const [userRatings, setUserRatings] = useState({});
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const apiUrl = process.env.REACT_APP_API_BASE_URL || "https://imdb-user-portal-be.onrender.com";
    const navigate = useNavigate();
    const {movieId} = useParams();
    const {userId} = useParams();
    const token = sessionStorage.getItem('token');
    useEffect(() => {
        fetchMovies();
        if (isLoggedIn) {
            fetchUserRatings();
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
    const fetchUserRatings = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            console.log(userId)
            const response = await axios.get(`${apiUrl}/api/user/${userId}/ratings`, { headers: { Authorization: `Bearer ${token}` } });
            console.log(response.data.ratings)
            setUserRatings(response.data.ratings);
        } catch (error) {
            console.error('Error fetching user ratings:', error);
        }
    };
    

    const handleRating = async (movieId, ratingValue,userId) => {
        if (!isLoggedIn) {
            console.log(isLoggedIn)
            setShowLoginDialog(true);
        } else {
            try {
                debugger;
                const userId = sessionStorage.getItem('userId');
                console.log(userId)
                const response = await axios.post(`${apiUrl}/api/movies/${movieId}/rating`, { rating: ratingValue }, { headers: { Authorization: `Bearer ${token}` } });
                console.log(response.data.ratings)
                if (response.data.success) {
                    fetchMovies();
                    fetchUserRatings();
                } else {
                    console.error('Error adding rating:', response.data.error);
                }
            } catch (error) {
                console.error('Error adding rating:', error);
            }
        }
    };

    const handleLogin = () => {
        navigate('/login');
        setShowLoginDialog(false);
    };

    const handleCancel = () => {
        setShowLoginDialog(false);
    };

    const handleMovieDetail = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    return (
        <div className="flex  justify-center">
        <div className="max-w-md max-w-screen-md px-4 py-8">
            {movies.map((movie) => (
                <div key={movie.id} className="mb-8" onClick={() => handleMovieDetail(movie.id)} style={{ cursor: 'pointer' }}>
                    <h3 className="text-xl font-semibold text-center mb-2">{movie.title}</h3>
                    <img src={movie.poster_url} alt={movie.title} width="250" height="200" className='inline' />

                    <div className="text-yellow-500 mt-2 text-center">
                        {movie.rating && [...Array(Math.floor(movie.rating))].map((_, index) => (
                            <FontAwesomeIcon key={index} icon={fasStar} />
                        ))}
                        {movie.rating && movie.rating % 1 !== 0 && <FontAwesomeIcon icon={faStarHalfAlt} />}
                        {!movie.rating && 'No rating'}
                        <span>({movie.rating || 'Not rated'})</span>
                    </div>
                    <p className="text-gray-600 mt-2">{movie.description}</p>
                    <div className="flex justify-center space-x-2 mt-2">
                        <span>{token ? "Your Rating / " : ""} Rate Movie : </span>
                        {[...Array(5)].map((_, index) => (
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
            {showLoginDialog && (
                <div className="modal-overlay">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2 className="modal-title text-2xl font-semibold mb-4">Login Required</h2>
                            </div>
                            <div className="modal-body">
                                <p className="text-gray-700 mb-4">You need to log in to rate this movie.</p>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleLogin}>Login</button>
                                <button className="text-blue-500" onClick={handleCancel}>Cancel</button>
                            </div>
                            <div className="modal-footer"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
    
    );
};

export default Movies;