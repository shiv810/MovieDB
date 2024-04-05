import React from 'react'
import { useParams } from 'react-router-dom'
import NavBar from '../MainNavBar/NavBar'
import { useAuth0 } from '@auth0/auth0-react'
import SearchComponent from './SearchComponent'
import { useNavigate } from 'react-router-dom'

const SearchPage = () => {
    const {query} = useParams()
    const navigate = useNavigate();
    const {user, isLoading} = useAuth0();

    if(isLoading){
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

   const onClick = (movie) => {
        if (movie) {
            navigate(`/movies/${movie.id}`);
        }
    
   }

  return (
    <div>
      <NavBar user={user} />
      <SearchComponent query={query} onClick={onClick} />
    </div>
  )
}

export default SearchPage