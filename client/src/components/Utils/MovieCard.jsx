import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = (movie) => {
    const navigate = useNavigate();
    return (
        <div key={movie.id} className="bg-gray-300 rounded-lg overflow-hidden h-full min-h-400px">
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-64 object-cover"
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 min-h-16">{movie.title}</h3>
                <div className='min-h-30'>
                    <p className="">
                        Release Date: {movie.release_date}
                    </p>
                    <p className="">
                        Rating: {movie.vote_average}/10
                    </p>
                </div>
                <button onClick={() => navigate(`/movies/${movie.id}`)} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default MovieCard;
