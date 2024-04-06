const fetchReviews = async (movieId, setReviews) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${movieId}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      setReviews(prevReviews => data);
    } catch (error) {
      alert('Error fetching reviews: ' + error);
    }
  };

  const fetchWatchlist = async (accessToken, setWatchlist) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/watchlist`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setWatchlist(data);
    } catch (error) {
      alert('Error fetching watchlist: ' + error);
    }
  }

  const fetchRecommendations = async (movieId, setRecommendations) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/recommendations/${movieId}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      alert('Error fetching recommendations: ' + error);
    }
  }

  const fetchMovieDetails = async (movieId, setMovieDetails) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=034e14c6f2ab0e0ccfeea2a32339ffe3`);
    const data = await response.json();
    setMovieDetails(data);
  };


    export { fetchReviews, fetchWatchlist, fetchRecommendations, fetchMovieDetails };