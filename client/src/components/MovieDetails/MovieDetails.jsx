import React, { useState, useEffect } from 'react';
import { Spinner } from "flowbite-react";
import ReviewModal from '../ReviewModal/ReviewModal';
import RecommendationsTab from '../RecommendationTab/RecommendationTab';
import { useAuthToken } from '../../AuthTokenContext';
import ReviewCard from './ReviewCard';
import { Tabs } from "flowbite-react";
import { fetchReviews, fetchRecommendations, fetchWatchlist, fetchMovieDetails } from '../Utils/utils';
import { useAuth0 } from '@auth0/auth0-react';

const MovieDetails = ({ movieId }) => {

  const [movieJSON, setMovieDetails] = useState(null);
  const { accessToken } = useAuthToken() || {};
  const {isLoading} = useAuth0();
  const [isReviewTabOpen, setIsReviewTabOpen] = useState(true);
  const [isRecommendationTabOpen, setIsRecommendationTabOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isMutatingWatchlist, setIsMutatingWatchlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isOpened, setIsOpened] = useState(false);


  const handleAddReview = async (reviewData) => {
    try {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...reviewData, movieId: parseInt(movieId) }),
      });
      fetchReviews();
    } catch (error) {
      alert(error)
      alert('Error adding review');
    }
  };

  const handleAddRecommendation = async (recommendationData) => {
    try {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...recommendationData, movieIdRecommend: parseInt(recommendationData.movieId), movieIdParent: parseInt(movieId) }),
      });
      fetchRecommendations(movieId, setRecommendations);
    } catch (error) {
      alert('Error adding recommendation');
    }
  }

  const onClickAddToWatchlist = async () => {
    if (!accessToken) {
      alert('You must be logged in to add a movie to the watchlist');
      return;
    }
    setIsMutatingWatchlist(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ movieId: parseInt(movieId) }),
      });
      if (response.ok) {
        alert('Movie added to watchlist');
      } else {
        alert('Error adding movie to watchlist');
      }
    } catch (error) {
      alert('Error adding movie to watchlist');
    }
    setMovieDetails(prevMovie => ({ ...prevMovie, isWatchlisted: true }));
    setIsMutatingWatchlist(false);
  }

  const HandleWatchlistRemove = async () => {
    setIsMutatingWatchlist(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/watchlist/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        alert('Movie removed from watchlist');
      } else {
        alert('Error removing movie from watchlist');
      }
    } catch (error) {
      alert('Error removing movie from watchlist');
    }
    setMovieDetails(prevMovie => ({ ...prevMovie, isWatchlisted: false }));
    setIsMutatingWatchlist(false);
  }

  const handleAddReviewButtonClick = () => {
    if (!accessToken) {
      alert('You must be logged in to add a movie to the watchlist');
      return;
    }
    setIsOpened(true);
  }

  useEffect(() => {
    fetchMovieDetails(movieId, setMovieDetails);
    fetchReviews(movieId, setReviews);
    fetchRecommendations(movieId, setRecommendations);
   
    if (window.location.href.includes('recommended')) {
      setIsReviewTabOpen(false);
      setIsRecommendationTabOpen(true);
    } else {
      setIsReviewTabOpen(true);
      setIsRecommendationTabOpen(false);
    }
  }, [movieId]);

  useEffect(() => {
    if(accessToken) {
      fetchWatchlist(accessToken, setWatchlist);
    }
  }, [accessToken]);

  useEffect(() => {
    if (watchlist.length > 0) {
      setMovieDetails(prevMovie => ({ ...prevMovie, isWatchlisted: watchlist.some(item => item.movieId === parseInt(movieId)) }));
    }
  }, [watchlist, movieId]);


  if (movieJSON === null || movieJSON.original_title === undefined || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <div className='flex flex-row w-full'>
        <div className='relative w-full bg-no-repeat bg-cover ' style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://image.tmdb.org/t/p/w500${movieJSON.poster_path})` }}>
          <div className='p-4 lg:px-40 md:px-20 flex flex flex-row flex-wrap'>
            <div className=''>
              <img src={`https://image.tmdb.org/t/p/w500${movieJSON.poster_path}`} alt={movieJSON.original_title} className='w-72 h-90' />
            </div>
            <div className='pt-10'>
              <div className='flex flex-row'>
                <h1 className='text-4xl font-bold text-gray-200'>{movieJSON.original_title.substring(0, 100)}</h1>
                <h2 className='text-4xl ml-2 text-gray-200'>({movieJSON.release_date.split('-')[0]})</h2>
              </div>
              <div className='flex flex-row flex-wrap'>
                <span className='text-md ml-1 text-gray-200'>{movieJSON.release_date ? new Date(movieJSON.release_date).toISOString().split('T')[0] : "Unknown"} (US)</span>
                {movieJSON.genres.map((genre) => (
                  <span key={genre.id} className='text-md ml-1 text-gray-200'>{genre.name}</span>
                ))}
                <span className='text-md ml-1 text-gray-200'>{Math.floor(movieJSON.runtime / 60)}h {movieJSON.runtime % 60}min</span>
              </div>
              <div className='flex flex-row mt-5 items-center'>
                <div className='relative w-14 h-14'>
                  <svg className='absolute top-0 left-0' width='100%' height='100%' viewBox='0 0 100 100' fill="#081c22" xmlns='http://www.w3.org/2000/svg'>
                    <circle cx='50' cy='50' r='48' stroke='#081c22' strokeWidth='4' />
                    <circle cx='50' cy='50' r='48' stroke='#21d07a' strokeWidth='4' strokeDasharray={`${(movieJSON.vote_average * 10) * 3.14} 301.592`} strokeLinecap='round' />
                  </svg>
                  <div className='absolute top-0 left-0 flex items-center justify-center w-14 h-14'>
                    <span className='text-sm text-white'>{Math.round(movieJSON.vote_average * 10)}%</span>
                  </div>
                </div>
                <div className='ml-2'>
                  <span className='text-md ml-1 text-white font-bold text-wrap'>User Score</span>
                </div>
              </div>
              <div className='flex flex-row mt-5 flex-wrap'>
                {movieJSON.isWatchlisted === true ? (
                <button
                  className='mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-52'
                  onClick={HandleWatchlistRemove}
                  disabled={isMutatingWatchlist}
                >
                  {isMutatingWatchlist ? <Spinner /> : 'Remove From your Watchlist'}
                </button>
                ) : (
                <button
                  className='mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-52'
                  onClick={onClickAddToWatchlist}
                  disabled={isMutatingWatchlist}
                >
                  {isMutatingWatchlist ? <Spinner /> : 'Add to your watchlist'}
                </button>
                )}
                <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
                  Watch trailer
                </button>
              </div>
              <div>
                <h2 className='text-2xl mt-5 text-white'>Overview</h2>
                <p className='text-md mt-2 text-white max-w-5xl'>{movieJSON.overview}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='p-4 justify-between lg:px-40 md:px-20 flex flex-wrap lg:flex-normal'>
        <div className='w-full lg:w-4/5 md:w-4/5'>
          <p className='text-4xl font-bold pb-5'>Socials</p>
          <Tabs aria-label="Tabs with underline" style="pills" className='w-full'>
            <Tabs.Item active={isReviewTabOpen}  title={<span className='text-2xl font-bold'>Reviews</span>} className='w-full'>
            <div className='pt-5'>
                <div className='flex flex-col gap-10'>
                {reviews.length === 0 && <p className='text-xl font-semibold pt-5'>No reviews yet</p>}
                {reviews.map((review, index) => (
                  <ReviewCard user={review.user} stars={review.stars} time={review.time} content={review.content} movieId={movieId} id={review.id} key={index}/>
                ))}
                </div>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5' onClick={() => handleAddReviewButtonClick()}>Add Review</button>
                <ReviewModal
                  isOpen={isOpened}
                  onClose={() => setIsOpened(false)}
                  onAddReview={(reviewData) => handleAddReview(reviewData)}
                />
              </div>
            </Tabs.Item>
            <Tabs.Item active={isRecommendationTabOpen} title={<span className='text-xl font-bold'>Recommendations</span>} className='w-full'>
            <div className='pt-5'>
                <RecommendationsTab recommendations={recommendations} movieId={movieJSON.id} recommendedURL={window.location.href} handleAddRecommendation={handleAddRecommendation} />
              </div>
            </Tabs.Item>
          </Tabs>
        </div>

        <div className='flex flex-col' id="facts">
          <h2 className='text-4xl mt-5 text-black'>Facts</h2>
          <div className='mt-2'>
            <h3 className='text-xl font-semibold text-black'>Status</h3>
            <p className='text-lg text-black'>{movieJSON.status}</p>
          </div>
          <div className='mt-2'>
            <h3 className='text-xl font-semibold text-black'>Language</h3>
            <p className='text-lg text-black'>
              {movieJSON.original_language === 'en' ? 'English' : movieJSON.original_language}
            </p>
          </div>
          <div className='mt-2'>
            <h3 className='text-xl font-semibold text-black'>Budget</h3>
            <p className='text-lg text-black'>{
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
              }).format(movieJSON.budget)
            }</p>
          </div>
          <div className='mt-2'>
            <h3 className='text-xl font-semibold text-black'>Revenue</h3>
            <p className='text-lg text-black'>{
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
              }).format(movieJSON.revenue)
            }</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
