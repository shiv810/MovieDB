import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './MainNavBar/NavBar';
import { Tabs } from "flowbite-react";
import React, { useEffect, useState } from 'react';
import { useAuthToken } from "../AuthTokenContext";
import ReviewCard from './MovieDetails/ReviewCard';
import RecommendationCard from './RecommendationTab/RecommendationCard';

const Profile = () => {
    const { user, setUser } = useAuth0();
    const { accessToken } = useAuthToken();
    const [reviews, setReviews] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [movies, setMovies] = useState([]);
    const [movieParent, setMovieParent] = useState([]);

    const handleNameChange = (e) => {
        setEditedName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEditedEmail(e.target.value);
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/reviews/${user.sub}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            alert('Error fetching reviews: ' + error);
        }
    };
    const fetchRecommendations = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/recommendations/${user.sub}`, {
                headers: {
                    'Cache-Control': 'no-cache', // Prevent caching
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            setRecommendations(data);
        } catch (error) {
            alert('Error fetching recommendations: ' + error);
        }
    }

    const fetchUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.sub}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            if (data && data.email && data.name) {
                setEditedName(data.name);
                setEditedEmail(data.email);
            }
        } catch (error) {
            alert('Error fetching user: ' + error);
        }
    }

    const handleReviewUpdate = async (review) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${review.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(review),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchReviews();
        } catch (error) {
            alert('Error updating review: ' + error);
        }
    };
    const handleReviewDelete = async (review) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${review.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchReviews();
        } catch (error) {
            alert('Error deleting review: ' + error);
        }
    };

    const handleRecommendationDelete = async (recommendation, index) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/recommendations/${recommendation.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Update recommendations array
            const updatedRecommendations = recommendations.filter((_, i) => i !== index);
            setRecommendations(updatedRecommendations);
            // Update movies array
            const updatedMovies = movies.filter((_, i) => i !== index);
            setMovies(updatedMovies);
        } catch (error) {
            alert('Error deleting recommendation: ' + error);
        }
    };


    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.sub}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name: editedName,
                    email: editedEmail,
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchUser();
            setIsEditing(false);
        } catch (error) {
            alert('Error updating user: ' + error);
        }
    }

    const fetchMovies = async () => {
        const promises = recommendations.map((recommendation) => {
            return fetch(`https://api.themoviedb.org/3/movie/${recommendation.movieIdRecommend}?api_key=034e14c6f2ab0e0ccfeea2a32339ffe3`)
                .then((response) => response.json());
        });

        const fetchedMovies = await Promise.all(promises);
        setMovies(fetchedMovies);
    };

    useEffect(() => {
        if (user && user.hasOwnProperty('sub') && accessToken) {
            fetchReviews();
            fetchUser();
            fetchRecommendations();
        }
    }, [accessToken, user]);

    useEffect(() => {
        fetchMovies();
    }, [recommendations]);

    if (!user)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    return (
        <>
            <Navbar user={user} />
            <div className="dark:!bg-navy-800 shadow-shadow-500 shadow-3xl rounded-primary relative mx-auto flex h-full w-full max-w-[550px] flex-col items-center bg-white bg-cover bg-clip-border p-[16px] dark:text-white dark:shadow-none shadow-t">
                <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover" style={{ backgroundImage: 'url("https://i.ibb.co/FWggPq1/banner.png")' }}>
                    <div className="absolute -bottom-12 flex h-[88px] w-[88px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400">
                        <img className="h-full w-full rounded-full" src={user.hasOwnProperty("picture") ? user.picture : "https://github.com/shadcn.png"} alt="" />
                    </div>
                </div>
                <div className="mt-16 flex flex-col items-center">
                    <h4 className="text-bluePrimary text-xl font-bold">{user.hasOwnProperty("name") ? user.name : user.email}</h4>
                </div>
                <div className="mt-6 w-full items-center">
                    <div className="w-full flex justify-center">
                        <Tabs aria-label="Tabs with underline" style="underline" className='w-full'>
                            <Tabs.Item active title="Profile">
                                <div className="mt-2 flex flex-col">
                                    <form className="w-full mx-auto">
                                        <div className="mb-5">
                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="name@flowbite.com"
                                                value={editedEmail}
                                                onChange={handleEmailChange}
                                                disabled={!isEditing}
                                                required />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Your name"
                                                value={editedName}
                                                onChange={handleNameChange}
                                                disabled={!isEditing}
                                                required />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="Auth0Id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Auth0ID</label>
                                            <input
                                                type="text"
                                                id="Auth0Id"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Your Auth0Id"
                                                value={user.sub}
                                                disabled={true}
                                                required />
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="email_verified" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email verified</label>
                                            <input
                                                type="text"
                                                id="email_verified"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Email verified"
                                                value={user.email_verified?.toString()}
                                                disabled={true}
                                                required />
                                        </div>

                                        {!isEditing && (
                                            <button onClick={() => setIsEditing(true)} className="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Edit Profile</button>
                                        )}
                                        {isEditing && (
                                            <div className="flex justify-between gap-5">
                                                <button onClick={() => setIsEditing(false)} className="text-white bg-gray-400 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Cancel</button>
                                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleUpdateProfile}>Submit Changes</button>
                                            </div>
                                        )}

                                    </form>
                                </div>
                            </Tabs.Item>
                            <Tabs.Item title="Reviews" className=''>
                                <div className='flex flex-col gap-10'>
                                    {reviews.length > 0 ? (
                                        reviews.map((review, index) => (
                                            <ReviewCard key={index} id={review.id} user={user.hasOwnProperty("name") ? user.name : user.email} time={review.createdAt} stars={review.stars} content={review.review} movieId={review.movieId} picture={user.picture ? user.picture : ""} onUpdate={(reviewUpdated) => { handleReviewUpdate(reviewUpdated) }} onDelete={(review) => handleReviewDelete(review)} />
                                        ))
                                    ) : (
                                        <p className='p-2 text-xl font-bold'>No Reviews made yet</p>
                                    )}
                                </div>
                            </Tabs.Item>
                            <Tabs.Item title="Recommendations">
                                <div className='flex flex-col gap-10'>
                                    {recommendations.length > 0 ? (
                                        recommendations.map((recommendation, index) => (
                                            <RecommendationCard key={index} movie_id={recommendation.movieIdRecommend} recommendation={recommendations[index]} handleRecommendationDelete={(recommendation) => handleRecommendationDelete(recommendation, index)} />
                                        ))
                                    ) : (
                                        <p className='p-2 text-xl font-bold'>No Recommendation made yet</p>
                                    )}
                                </div>
                            </Tabs.Item>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
