import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './NavBar';
import { Tabs } from "flowbite-react";
import React, { useEffect, useState } from 'react';
import { useAuthToken } from "../AuthTokenContext";
import ReviewCard from './ReviewCard';
import RecommendationCard from './RecommendationCard';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastProps } from './Utils/utils';
import MainFooter from './MainFooter';

const Profile = () => {
    const { user, isLoading, isAuthenticated } = useAuth0();
    const { accessToken } = useAuthToken();
    const navigate= useNavigate();
    const [reviews, setReviews] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [userDetails, setUserDetails] = useState({}); 
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [movies, setMovies] = useState([]);

    const handleNameChange = (e) => {
        setEditedName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEditedEmail(e.target.value);
    };

    const handleChangeCancel = (e) => {
        e.preventDefault();
        setIsEditing(false);
        setEditedName(userDetails.name);
        setEditedEmail(userDetails.email);
    }

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
            toast.error('Error fetching reviews: ' + error, toastProps);
        }
    };
    const fetchRecommendations = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/recommendations/${user.sub}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            setRecommendations(data);
        } catch (error) {
            toast.error('Error fetching recommendations: ' + error, toastProps);
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
                setUserDetails(data);
                setEditedName(data.name);
                setEditedEmail(data.email);
            }
        } catch (error) {
            toast.error('Error fetching user: ' + error, toastProps);
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
            toast.error('Error updating review: ' + error, toastProps);
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
            toast.error('Error deleting review: ' + error, toastProps);
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
            const updatedRecommendations = recommendations.filter((_, i) => i !== index);
            setRecommendations(updatedRecommendations);
            const updatedMovies = movies.filter((_, i) => i !== index);
            setMovies(updatedMovies);
        } catch (error) {
            toast.error('Error deleting recommendation: ' + error, toastProps);
        }
    };


    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if(editedName.trim() === '' || editedEmail.trim() === ''){
            toast.error('Updated Name or Email cannot be empty', toastProps);
            return;
        }
        if (!editedEmail.includes('@') || !editedEmail.includes('.')) {
            toast.error('Invalid email address', toastProps);
            return;
        }
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
            toast.error('Error updating user: ' + error, toastProps);
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

    const handleNotLoggedIn = () => {
        setTimeout(() => {
            navigate("/")
        }, 5000);
    }

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



    if (isLoading){
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    } else {
        if (!isAuthenticated) {
            handleNotLoggedIn();
            return (
                <>
                    <Navbar user={null} />
                    <div className="flex justify-center items-center h-screen">
                        <div className="bg-red-500 text-white px-6 py-4 border-0 rounded relative mb-4">
                            <span className="text-xl inline-block mr-5 align-middle">
                                <i className="fas fa-bell" />
                            </span>
                            <span className="inline-block align-middle mr-8">
                                <b className="capitalize">Alert:</b> Please login to view your profile. You will be redirected to home in 5 seconds.
                            </span>
                        </div>
                    </div>
                </>
            );
        }
    }
        
        
    return (
        <>
            <ToastContainer />
            <Navbar user={user} toast={toast}/>
            <div className="dark:!bg-navy-800 shadow-shadow-500 shadow-3xl rounded-primary relat</div>ive mx-auto flex h-full w-full max-w-[550px] flex-col items-center bg-white bg-cover bg-clip-border p-[16px] dark:text-white dark:shadow-none shadow-t">
                <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover" style={{ backgroundImage: 'url("https://i.ibb.co/FWggPq1/banner.png")' }}>
                    <div className="absolute -bottom-12 flex h-[88px] w-[88px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400">
                        <img className="h-full w-full rounded-full" src={user.hasOwnProperty("picture") ? user.picture : "https://github.com/shadcn.png"} alt="User's Avatar" />
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
                                                className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                                className="bg-gray-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                                <button onClick={handleChangeCancel} className="text-white bg-gray-400 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Cancel</button>
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
            <MainFooter />
        </>
    );
};

export default Profile;

