import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import { useAuth0 } from '@auth0/auth0-react';
import { Carousel, Footer } from "flowbite-react";
import { useAuthToken } from '../AuthTokenContext';
import MovieCard from './MovieCard';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastProps } from './Utils/utils';
import MainFooter from './MainFooter';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const { accessToken } = useAuthToken();
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/movie/popular?api_key=034e14c6f2ab0e0ccfeea2a32339ffe3&language=en-US&page=1'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMovies(data.results);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching movies: ' + error, toastProps);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchWatchlistAndMovieDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/watchlist`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const watchlist = await response.json();
  
        const updatedWatchlist = await Promise.all(watchlist.map(async (item) => {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${item.movieId}?api_key=034e14c6f2ab0e0ccfeea2a32339ffe3`);
          const data = await response.json();
          return { ...item, ...data };
        }));
        setWatchlist(updatedWatchlist);
      } catch (error) {
        toast.error('Error fetching watchlist: ' + error, toastProps);
      }
    };

    fetchWatchlistAndMovieDetails();
  }, [accessToken]);

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen" aria-label='loadingSpinner'>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <NavBar user={user} toast={toast} />
      <div className="bg-gray-900 text-white">
        {isAuthenticated ? (
          <div className="carousel h-[25rem] flex justify-center items-center">
            <Carousel>
              {movies.slice(0, 10).map((movie, index) => (
                <div key={index} className="carousel-item bg-cover bg-center h-screen flex items-end max-h-[25rem] z-[2]" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})` }}>
                  <div className="carousel-caption z-[10] p-4 lg:px-40 md:px-20  w-full h-full flex flex-col-reverse pb-20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="flex flex-col items-center justify-center">
                      <h3 className=''>{movie.title}</h3>
                      <button onClick={() => navigate(`/movies/${movie.id}`)} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" aria-label="carouselMovieDetails">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <div className='py-20 flex flex-col items-center justify-center'>
            <div className="bg-gray-900 text-white py-20 flex flex-col items-center justify-center">
              <div className="container mx-auto p-4 text-center">
                <h1 className="text-4xl font-semibold mb-4">
                  Welcome to MovieDB
                </h1>
                <p className="text-lg mb-8">
                  Explore the latest and most popular movies here.
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded" onClick={() => loginWithRedirect({screen_hint: "signup"})} aria-label='cta-signup'>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 lg:px-40 md:px-20">
        {isAuthenticated && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Watchlist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
              {
                watchlist.map(item => (
                  <div key={item.id} aria-label='watchlistCard'>
                    <MovieCard key={item.id} {...item}/>
                  </div>
                ))
              }
              <div className="bg-gray-400 rounded-lg overflow-hidden h-full min-h-96 flex items-center justify-center cursor-pointer" onClick={() => navigate(`/search`)}>
                <div className="text-4xl text-white">+</div>
              </div>
            </div>

          </div>
        )}
        
        <h2 className="text-2xl font-semibold mb-4">Popular Movies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
          {movies.map(movie => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </div>
      <MainFooter />
    </>
  );
};

export default Home;
