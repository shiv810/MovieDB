import React, { useEffect, useState } from 'react'
import { fetchMovieDetails } from './Utils/utils'

const RecommendationCard = ({ movie_id, recommendation, handleRecommendationDelete }) => {
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        fetchMovieDetails(movie_id, setMovie);
    }, [movie_id]);


    if (!movie || movie.poster_path === null || movie.title === undefined) {
        return null;
    }

    return (
        <div>
            <div className="w-full pt-5 mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col w-full">
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-56 object-cover" />
                    <div className="p-4 min-w-[25rem]">
                        <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                        <p className="text-gray-700 mb-2">Recommended by {recommendation.user}</p>
                        <p className="text-gray-700">{recommendation.comment}</p>
                        {handleRecommendationDelete && (
                            <div className="flex justify-end mt-2">
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleRecommendationDelete(recommendation)}>Delete</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecommendationCard
