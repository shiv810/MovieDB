import { useAuth0 } from '@auth0/auth0-react'
import { useAuthToken } from "../AuthTokenContext";
import Navbar from './NavBar'
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainFooter from './MainFooter';

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
            <ToastContainer />
            <Navbar user={user} toast={toast}/>
            <div>
                <h1 className="text-4xl text-center font-semibold mt-4">Auth Debugger</h1>
            </div>
            <div className='flex flex-col min-h-screen justify-between'>
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
            <MainFooter />
            </div>
        </>
    )
}

export default AuthDebugger