import React, { useEffect, useState } from 'react'
import SearchPage from '../SearchBar/SearchPage'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import NavBar from '../MainNavBar/NavBar'
import { useAuth0 } from '@auth0/auth0-react'
import { FaArrowLeft } from 'react-icons/fa';

const RecommendationPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth0();
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);

    const onClick = (movie) => {
        if (movie) {
            navigate(`/movies/${movieId}?recommended=${movie.id}`);
        }
    }

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=034e14c6f2ab0e0ccfeea2a32339ffe3`);
            const data = await response.json();
            setMovie(data);
        };
        fetchMovieDetails();
    }, [movieId]);

    if (!user || !movie) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }
    return (
        <div>
            <NavBar user={user} />
            <div className='bg-gray-300 flex items-center max-h-20 p-4 lg:px-40 md:px-20 flex'>
                <button onClick={() => navigate(`/movies/${movieId}`)} className="focus:outline-none"><FaArrowLeft className="text-gray-600" /></button>
                <img src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`} alt="movie poster" className="max-h-20 ml-4 rounded-lg shadow-md" />
                <p className="ml-4 text-gray-800 font-bold">{movie.title}</p>
            </div>
            <SearchPage onClick={onClick} />
        </div>
    )
}

export default RecommendationPage;
