import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Navbar from './MainNavBar/NavBar'

const Profile = () => {
    const { user } = useAuth0()

    if (!user)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    return (
        <>
            <Navbar user={user} />
        </>
    )
}

export default Profile