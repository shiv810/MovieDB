import React, { useState, useEffect } from 'react';

const SearchPage = ({onClick}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [genres, setGenres] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (searchQuery.trim() === '') {
            return;
        }
        try {
            setLoading(true);
            let url = `https://api.themoviedb.org/3/search/movie?api_key=034e14c6f2ab0e0ccfeea2a32339ffe3&query=${searchQuery}&page=${page}`;
            if (selectedGenre !== '') {
                url += `&with_genres=${selectedGenre}`;
            }
            if (selectedCountry !== '') {
                url += `&region=${selectedCountry}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            setSearchResults(data.results);
            setTotalPages(Math.min(data.total_pages, 5));
        } catch (error) {
            console.error('Error searching for movies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(onClick){
            onClick(selectedMovie);
        }
    }, [selectedMovie]);

    const handleGenreChange = (genreId) => {
        setSelectedGenre(genreId);
    };

    const handleCountryChange = (countryCode) => {
        setSelectedCountry(countryCode);
    };

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            handleSearch();
        }
    }, [page]);

    useEffect(() => {
        const fetchGenres = async () => {
            const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=034e14c6f2ab0e0ccfeea2a32339ffe3');
            const data = await response.json();
            setGenres(data.genres);
        };

        const fetchCountries = async () => {
            const response = await fetch('https://restcountries.com/v3.1/all');
            let data = await response.json();
            data = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
            setCountries(data);
        };

        fetchGenres();
        fetchCountries();
    }, []);

    return (
        <>
            <div className="container p-4 lg:px-40 md:px-20 flex flex-row flex-wrap">
                <div className="flex flex-col flex-wrap w-full mb-4">
                    <div className='flex flex-row'>
                        <input
                            type="text"
                            className="border border-gray-300 rounded-md p-2 w-full mr-2"
                            placeholder="Search for a movie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className='flex flex-row flex-wrap mb-4 justify-between'>
                    <div className='flex flex-col pt-5 gap-y-10 pr-10'>
                        <div>
                            <label className="mr-2">Filter by Genre:</label>
                            <select
                                className="border border-gray-300 rounded-md p-2"
                                value={selectedGenre}
                                onChange={(e) => handleGenreChange(e.target.value)}
                            >
                                <option value="">All Genres</option>
                                {genres.map((genre) => (
                                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mr-2">Filter by Country:</label>
                            <select
                                className="border border-gray-300 rounded-md p-2 max-w-36"
                                value={selectedCountry}
                                onChange={(e) => handleCountryChange(e.target.value)}
                            >
                                <option value="">All Countries</option>
                                {countries.map((country) => (
                                    <option key={country.cca2} value={country.cca2}>{country.name.common}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 max-w-2/3 lg:w-2/3">
                        {searchResults.map((movie) => (
                            <div
                                key={movie.id}
                                className="border border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-100 flex flex-col"
                                onClick={() => setSelectedMovie(movie)}
                            >
                                <div className="flex">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                                        alt={movie.title}
                                        className="mr-4 max-w-1/2 max-h-36 object-cover"
                                    />
                                    <div>
                                        <div className="font-semibold">{movie.title}</div>
                                        <div className="text-gray-500">{new Date(movie.release_date).getFullYear()}</div>
                                        <div className="text-sm text-gray-700 mt-2">{movie.overview}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {loading && <p className="text-gray-500">Loading...</p>}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            className={`mx-1 px-3 py-1 rounded-md ${page === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setPage(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

export default SearchPage;
