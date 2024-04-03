import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RecommendationsTab({ recommendations, movieId, recommendedURL, handleAddRecommendation }) {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const movieIdParent = movieId ? movieId : 0;
    const [recommendMovieID, setRecommendMovieID] = useState(0);


    useEffect(() => {
        const fetchMovies = async () => {
            const promises = recommendations.map((recommendation) => {
                return fetch(`https://api.themoviedb.org/3/movie/${recommendation.movieIdRecommend}?api_key=034e14c6f2ab0e0ccfeea2a32339ffe3`)
                    .then((response) => response.json());
            });

            const fetchedMovies = await Promise.all(promises);
            setMovies(fetchedMovies);
            setLoading(false);
            if (recommendedURL) {
                if (recommendedURL.includes('recommended')) {
                    const movieId = recommendedURL.split('=')[1];
                    setRecommendMovieID(movieId);
                }
            }

        };

        fetchMovies();
    }, [recommendations]);

    if (movieIdParent === 0) {
        return (
            <div className="flex flex-wrap">
                <p className="text-2xl font-semibold pt-5">No movie selected</p>
            </div>
        );
    }

    const handleSubmit = () => {
        const comment = document.getElementById('userComments').value;
        handleAddRecommendation({ movieId: recommendMovieID, comment: comment ? comment : 'No comment' })
        navigate(`/movies/${movieIdParent}`);
        setRecommendMovieID(0);
    }

    const handleCancel = () => {
        navigate(`/movies/${movieIdParent}`);
        setRecommendMovieID(0);
    }

    if (recommendMovieID !== 0) {
        return (
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                        Why do you recommend this movie?
                                    </h3>
                                    <div className="mt-2">
                                        <textarea className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md" id="userComments" placeholder="Your comment here"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleSubmit}>
                                Submit
                            </button>
                            <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );

    }

    return (
        <>
            <div className="flex flex-wrap gap-2">
                {loading ? (
                    <p>Loading...</p>
                ) : movies.length === 0 ? (
                    <>
                        <div className='flex flex-col'>
                            <p className="text-2xl font-semibold pt-5">No recommendations yet</p>
                        </div>
                    </>
                ) : (
                    movies.map((movie, index) => (
                        <div className="w-full sm:w-1/2 lg:w-1/3 pt-5" key={index}>
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-56 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                                    <p className="text-gray-700 mb-2">Recommended by {recommendations[index].user}</p>
                                    <p className="text-gray-700">{recommendations[index].comment}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5" onClick={() => navigate(`/recommendations/${movieIdParent}`)}> Recommend a movie</button>
        </>
    );
}

export default RecommendationsTab;
