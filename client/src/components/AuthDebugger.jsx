import { useAuth0 } from '@auth0/auth0-react'
import { useAuthToken } from "../AuthTokenContext";
import Navbar from './MainNavBar/NavBar'
import React from 'react'

const AuthDebugger = () => {
    const { user, isLoading } = useAuth0()
    const { accessToken } = useAuthToken();


    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    return (
        <>
            <Navbar user={user} />
            <div>
                <h1 className="text-4xl text-center font-semibold mt-4">Auth Debugger</h1>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {user ? (
                    <>
                        <div className="py-4">
                            <p className="text-lg font-semibold">Access Token:</p>
                            <pre className="overflow-x-auto bg-gray-200 rounded-lg p-4">{JSON.stringify(accessToken, null, 2)}</pre>
                        </div>
                        <div className="py-4">
                            <p className="text-lg font-semibold">User Info</p>
                            <pre className="overflow-x-auto bg-gray-200 rounded-lg p-4">{JSON.stringify(user, null, 2)}</pre>
                        </div>
                    </>
                ) : (
                    <div className="py-4">
                        <p className="text-lg font-semibold">User Info</p>
                        <pre className="overflow-x-auto bg-gray-200 rounded-lg p-4">No user logged in</pre>
                    </div>
                )}
            </div>
        </>
    )
}

export default AuthDebugger