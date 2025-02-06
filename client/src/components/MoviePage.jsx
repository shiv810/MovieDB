import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MovieDetails from './MovieDetails';
import NavBar from './NavBar';
import { useAuth0 } from '@auth0/auth0-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainFooter from './MainFooter';

const MoviePage = () => {
    const { movieId } = useParams();
    const {user, isLoading} = useAuth0();
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }
    return (
        <>
            <ToastContainer />
            <NavBar user={user} toast={toast}/>
            <MovieDetails movieId={movieId} toast={toast} />
            <MainFooter />
        </>
  )
}

export default MoviePage