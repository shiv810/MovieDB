import { useState, useEffect } from 'react';
import { useAuthToken } from '../AuthTokenContext';

const useReview = (movieId) => {
  const [reviews, setReviews] = useState([]);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${movieId}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${accessToken}`
          },
        });
        const data = await response.json();
        if (isMounted) {
          setReviews(data);
        }
      } catch (error) {
        alert('Error fetching reviews: ' + error);
      }
    };

    fetchReviews();
  }, [accessToken, movieId]);

  return reviews;
};

export default useReview;
