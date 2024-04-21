import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MdSearch } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';
import { toastProps } from './Utils/utils';


const NavBar = ({ user, toast}) => {
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuOptions = {
        center: [
            { name: 'Home', link: '/', auth: false, label: "home" },
            { name: 'Auth Debugger', link: '/authDebugger', auth: true, label: 'authDebugger' },
        ]
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const query = event.target.elements.search.value.trim();
        if (query) {
            event.target.elements.search.value = '';
            navigate(`/search/${query}`)
        } else {
            toast.error('Please enter a search query', toastProps);
        }
    };

    return (
        <nav className="bg-gray-800 items-center p-4 lg:px-40 md:px-20 flex">
            <div className="flex gap-3 sm:m-2 flex-grow items-center">
                {/* Logo */}
                <p className="text-white font-semibold">MovieDB</p>

                {/* Menu items for normal view and Search Bar */}
                <div className="hidden md:flex gap-2 h-full">
                    {menuOptions.center.map((option, index) => (
                        (option.auth === false || (option.auth === isAuthenticated && option.auth === true)) ?
                            (<Link key={index} to={option.link} className="text-white" aria-label={option.label} rel="noopener noreferrer">{option.name} </Link>) :
                            (<div key={index}></div>)
                    ))}
                </div>
                <form onSubmit={handleSearchSubmit} className="relative flex-grow flex justify-end h-full" aria-label="searchForm">
                    <input type="text" name="search" className="bg-gray-700 text-white p-2 rounded pr-10 w-full md:w-auto h-full" placeholder="Search..." />
                    <button type="submit" className="absolute right-0 top-0 mt-3 mr-3 text-gray-400" aria-label="searchButton">
                        <MdSearch />
                    </button>
                </form>

                {/* Hamburger Menu for smaller screens */}
                <div className="block md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none h-full">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
            {/* Login button for unauthenticated users */}
            {!isAuthenticated && (
                <div className="hidden md:flex items-center">
                    <button onClick={() => loginWithRedirect()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" aria-label="loginDesktop">
                        Log In
                    </button>
                </div>
            )}

            {/* User profile menu for md and larger screens */}
            {isAuthenticated && (
                <div className="hidden md:block relative inline-block text-left h-full pt-2">
                    <div>
                        <button type="button" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="focus:outline-none h-full" id="options-menu" aria-haspopup="true" aria-expanded="true" aria-label="profileButtonWeb">
                            <img src={user.hasOwnProperty('picture') ? user.picture : "https://github.com/shadcn.png"} alt={user.name} className="h-10 w-10 rounded-full hover:shadow-outline focus:shadow-outline border border-transparent hover:border-blue-500 focus:border-blue-500" referrerPolicy="no-referrer" />
                        </button>
                    </div>
                    {isProfileMenuOpen && (
                        <div className="z-[1] origin-top-right absolute right-0 mt-2 w-58 min-w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" aria-label="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <div className="block py-1 h-full" aria-label="none">
                                <Link to="/profile" className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 h-full" aria-label="profileWeb" rel="noopener noreferrer">Profile</Link>
                                <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="block w-full bg-gray-100 h-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 h-full" aria-label="logoutWeb">Sign out</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden z-[1] absolute top-16 right-0 w-full bg-gray-800">
                    <div className="flex flex-col gap-2 py-2 h-full">
                        {menuOptions.center.map((option, index) => (
                            (option.auth === false || (option.auth === isAuthenticated && option.auth === true)) ?
                                (<Link key={index} to={option.link} className="text-white text-center" aria-label={option.label} rel="noopener noreferrer">{option.name}</Link>) :
                                (<div key={index}></div>)
                        ))}
                        {isAuthenticated && (
                            <>
                                <Link to="/profile" className="text-white text-center h-full" aria-label='profileMobile'>Profile</Link>
                                <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="bg-red-500 text-white font-semibold py-2 px-4 rounded mx-auto hover:border-indigo-500 hover:bg-transparent h-full" aria-label="logoutMobile" rel="noopener noreferrer">Sign out</button>
                            </>
                        )}
                        {!isAuthenticated && (
                            <>
                                <button onClick={() => loginWithRedirect()} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mx-auto hover:border-indigo-500 hover:bg-transparent h-full" aria-label="loginMobile">Log In</button>
                            </>

                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
