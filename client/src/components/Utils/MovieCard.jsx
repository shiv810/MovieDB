import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = (movie) => {
    const navigate = useNavigate();
    return (
        <article key={movie.id} className="bg-gray-300 rounded-lg overflow-hidden h-full min-h-400px">
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`Poster of ${movie.title}`}
                className="w-full h-64 object-cover"
                rel='preconnect'
            />
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 min-h-16">{movie.title}</h3>
                <div className='min-h-30'>
                    <p className="">
                        Release Date: <time dateTime={movie.release_date}>{movie.release_date}</time>
                    </p>
                    <p className="">
                        Rating: <span>{movie.vote_average}/10</span>
                    </p>
                </div>
                <button onClick={() => navigate(`/movies/${movie.id}`)} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" aria-label='click-for-more-details-on-movie'>
                    View Details
                </button>
            </div>
        </article>
    );
};

export default MovieCard;
