import { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid'
import ReviewModal from './ReviewModal';

const ReviewCard = ({ user, time, stars, id, content, picture, onUpdate, onDelete, movieId }) => {
    const [showModal, setShowModal] = useState(false);
    const [defaultText, setDefaultText] = useState(content);
    const [defaultStars, setDefaultStars] = useState(stars);
    const [movieDetails, setMovieDetails] = useState(null);

    const handleUpdate = ({ text, stars }) => {
        onUpdate({ text, stars, movieId, id });
        setShowModal(false);
    }

    const handleDelete = () => {
        onDelete({ id });
    }

    useEffect(() => {
        setDefaultText(content);
        setDefaultStars(stars);
    }, [content, stars]);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=034e14c6f2ab0e0ccfeea2a32339ffe3`);
            const data = await response.json();
            setMovieDetails(data);
        };
        fetchMovieDetails()
    }, []);

    return (
        <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden w-full p-4 border border-gray-300">
            <div className="flex items-center p-4 justify-between">
                <div className="flex items-center">
                    <div className="mr-4">
                        {(!(picture === undefined)) ?
                            (<div>
                                <img src={picture} alt="user" className="rounded-full text-white w-20 h-15 flex items-center justify-center" />
                            </div>) :
                            (<div>

                                <span className="rounded-full bg-orange-500 text-white w-10 h-10 flex items-center justify-center">{user[0]}</span>

                            </div>)}

                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">A review by {user} {movieDetails ? 'for ' + movieDetails.title : ''}</h3>
                        <div className="flex items-center">
                            <div className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold flex flex-row items-center gap-x-1"><StarIcon className="h-3 w-3 leading-5 text-white-500" />{stars}</div>
                            <h5 className="ml-2">Written by {user} on {new Date(time).toLocaleDateString('us')}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-4">
                <p className="text-gray-700">{content}</p>
            </div>
            {onUpdate && onDelete && (
                <div className="flex flex-row items-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-24" onClick={() => setShowModal(true)}>Update</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2 w-24" onClick={() => handleDelete()}>Delete</button>
                </div>
            )}
            <ReviewModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                defaultValueText={defaultText}
                defaultValueStars={defaultStars}
                onAddReview={(reviewData) => handleUpdate(reviewData)}
            />
        </div>
    )
}

export default ReviewCard;
