import React, { useEffect, useState } from 'react'
import SearchComponent from './SearchComponent'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import NavBar from './NavBar'
import { useAuth0 } from '@auth0/auth0-react'
import { FaArrowLeft } from 'react-icons/fa';
import { fetchRecommendations, fetchMovieDetails } from './Utils/utils'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainFooter from './MainFooter'

const RecommendationPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth0();
    const { movieId } = useParams();
    const [excludeMovieIds, setExcludeMovieIds] = useState([]);
    const [recommendation, setRecommendation] = useState([]);
    const [movie, setMovie] = useState(null);

    const onClick = (movie) => {
        if (movie) {
            navigate(`/movies/${movieId}?recommended=${movie.id}`);
        }
    }

    useEffect(() => {
        fetchRecommendations(movieId, setRecommendation, toast); 
        setExcludeMovieIds([parseInt(movieId), ...recommendation.map((movie) => movie.movieIdRecommend)]);
    }, [])

    useEffect(() => {
        fetchMovieDetails(movieId, setMovie);
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
            <ToastContainer />
            <NavBar user={user} toast={toast}/>
            <div className='bg-gray-300 flex items-center max-h-20 p-4 lg:px-40 md:px-20 flex'>
                <button onClick={() => navigate(`/movies/${movieId}`)} className="focus:outline-none"><FaArrowLeft className="text-gray-600" /></button>
                <img src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`} alt="movie poster" className="max-h-20 ml-4 rounded-lg shadow-md" />
                <p className="ml-4 text-gray-800 font-bold">{movie.title}</p>
            </div>
            <SearchComponent onClick={onClick} excludeMovieIds={excludeMovieIds} toast={toast}/>
            <MainFooter />
        </div>
    )
}

export default RecommendationPage;
