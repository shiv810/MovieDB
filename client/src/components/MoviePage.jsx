import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MovieDetails from './MovieDetails/MovieDetails';
import NavBar from './MainNavBar/NavBar';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthToken } from '../AuthTokenContext';

const MoviePage = () => {
    const { movieId } = useParams();
    const {user} = useAuth0();
    const {accessToken} = useAuthToken();

    if (!accessToken || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }
    return (
        <>
            <NavBar user={user}/>
            <MovieDetails movieId={movieId} />
        </>
  )
}

export default MoviePage