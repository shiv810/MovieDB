const fetchReviews = async (movieId, setReviews, toast) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${movieId}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    const data = await response.json();
    setReviews(prevReviews => data);
  } catch (error) {
    if (toast) {
      toast.error('Error fetching reviews: ' + error, toastProps);
    } else {
      alert('Error fetching reviews: ' + error);
    }
  }
};

const fetchWatchlist = async (accessToken, setWatchlist, toast) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/watchlist`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    const data = await response.json();
    setWatchlist(data);
  } catch (error) {
    if (toast) {
      toast.error('Error fetching watchlist: ' + error, toastProps);
    } else {
      alert('Error fetching watchlist: ' + error);
    }
  }
}

  const fetchRecommendations = async (movieId, setRecommendations, toast) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/recommendations/${movieId}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      if (toast) {
        toast.error('Error fetching recommendations: ' + error, toastProps);
      } else {
        alert('Error fetching recommendations: ' + error);
      }
    }
  }

  const fetchMovieDetails = async (movieId, setMovieDetails, toast) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=034e14c6f2ab0e0ccfeea2a32339ffe3`);
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      const data = await response.json();
      data.movieId = data.movieId || movieId;
      setMovieDetails(data);
    } catch (error) {
      if (toast) {
        toast.error('Error fetching movie details: ' + error, toastProps);
      } else {
        alert('Error fetching movie details: ' + error);
      }
    }
  };


  const toastProps = {
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }

  export { fetchReviews, fetchWatchlist, fetchRecommendations, fetchMovieDetails, toastProps };