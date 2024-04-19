import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useAuth0 } from "@auth0/auth0-react";
import MovieDetails from "../components/MovieDetails";
import { useAuthToken } from "../AuthTokenContext";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn(() => ({
    isLoading: false
  })),
}));

jest.mock("../AuthTokenContext");

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));


describe("MovieDetails component: Without Auth", () => {
  // Test: Kung Fu Panda 4 is the title.
  beforeEach(() => {
    useAuthToken.mockReturnValue({
      accessToken: "",
    })
  });
  test("Title: renders movie title correctly", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });

    const originalTitle = () => screen.queryByText("Kung Fu Panda 4");
    expect(originalTitle()).toBeInTheDocument();
  });

  // Test: Kung Fu Panda 4 is a movie from the United States and overview.
  test("Overview: renders movie overview correctly", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });
    //Check if the overview is in the document
    const overview = screen.getByLabelText('overview');
    expect(overview).toBeInTheDocument();

    //Get overviewBody role
    const overviewBody = screen.getByLabelText('overviewBody');
    expect(overviewBody).toHaveTextContent("Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior. As such, he will train a new kung fu practitioner for the spot and will encounter a villain called the Chameleon who conjures villains from the past.");
  });

  // Test: Release Date for Kung Fu Panda 4 is March 2, 2024
  test("Release Date: renders movie release data correctly", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });

    //Get releaseDate role
    const releaseDate = screen.getByLabelText('releaseDate');
    expect(releaseDate).toBeInTheDocument();

    //Get releaseDate value and match it with the expected value
    expect(releaseDate).toHaveTextContent("2024-03-02 (US)");
  });

  // Test: Runtime for Kung Fu Panda 4 is 94 minutes or 1hr 34min
  test("Runtime: renders movie runtime correctly", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });

    //Get runtime role
    const runtime = screen.getByLabelText('runtime');
    expect(runtime).toBeInTheDocument();

    //Get runtime value and match it with the expected value
    expect(runtime).toHaveTextContent("1hr 34min");
  });

  // Test: Click Add to Watchlist button Expect a Toast to show "Please log in to add to watchlist"
  test("Add to Watchlist button: does the button works as expected", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });

    //Get Add to Watchlist button
    const addToWatchlistButton = screen.getByLabelText('addToWatchlistButton');
    expect(addToWatchlistButton).toBeInTheDocument();

    //Click Add to Watchlist button
    fireEvent.click(addToWatchlistButton);

    //Get Snackbar
    const snackbar = screen.getByRole('alert');
    expect(snackbar).toHaveTextContent("You must be logged in to add a movie to the watchlist");
  });

  // Test: Click Add Review button Expect a Toast to show "Please log in to add a review"
  test("Add Review Button: does the button work as expected", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });

    //Get Add Review button
    const addReviewButton = screen.getByLabelText('addReviewButton');
    expect(addReviewButton).toBeInTheDocument();

    //Click Add Review button
    fireEvent.click(addReviewButton);

    //Get Snackbar
    const snackbar = screen.getByRole('alert');
    expect(snackbar).toHaveTextContent("You must be logged in to add a review");
  });


});


describe("MovieDetails component: With Auth", () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    })
    useAuthToken.mockReturnValue({
      accessToken: "fake-access-token",
    });
    global.fetch = jest.fn((url, options) => {
      if (
        url === `${process.env.REACT_APP_API_URL}/watchlist` &&
        options.method === "GET"
      ) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
          ]),
        });
      } if (
        url === `${process.env.REACT_APP_API_URL}/watchlist` &&
        options.method === "POST"
      ) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            "id": 5,
            "auth0Id": "google-oauth2|00110000000000",
            "movieId": 1011985
          }),
        });
      } else if (
        url === `${process.env.REACT_APP_API_URL}/watchlist/1011985` &&
        options.method === "DELETE"
      ) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({

          }),
        });
      } else if (
        url === 'https://api.themoviedb.org/3/movie/1011985?api_key=034e14c6f2ab0e0ccfeea2a32339ffe3'
      ) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            original_title: "Kung Fu Panda 4",
          }),
        });
      } else if (
        url == `${process.env.REACT_APP_API_URL}/reviews/1011985` &&
        options.method === "GET"
      ) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              "time": "2024-04-05T04:28:33.778Z",
              "stars": 4,
              "content": "Good Watch",
              "user": "abcd@gmail.com"
            }
          ]),
        });
      } else if (
        url == `${process.env.REACT_APP_API_URL}/recommendations/1011985` &&
        options.method === "GET"
      ) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              "id": 20,
              "auth0Id": "auth0|660ef43c51aa90d60be60cf1",
              "movieIdParent": 1011985,
              "movieIdRecommend": 315011,
              "comment": "Good",
              "user": "abcd@gmail.com",
              "title": "Good"
            }
          ])
        })
      }
    });
  });

  // Test: Renders with auth without crashing
  test("Renders with auth without crashing", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
    });


    const originalTitle = () => screen.queryByText("Kung Fu Panda 4");
    expect(originalTitle()).toBeInTheDocument();
  })

  //Test: Add to Watchlist button: Adds the movie to watchlist and shows a toast and the button changes to Remove from Watchlist
  test("Add to Watchlist button: Adds the movie to watchlist and shows a toast and the button changes to Remove from Watchlist", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });

    //Get Add to Watchlist button
    const addToWatchlistButton = screen.getByLabelText('addToWatchlistButton');
    expect(addToWatchlistButton).toBeInTheDocument();

    //Click Add to Watchlist button
    fireEvent.click(addToWatchlistButton);

    //Wait for the toast to show
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });

    //Get Snackbar
    const snackbar = screen.getByRole('alert');
    expect(snackbar).toHaveTextContent("Movie added to watchlist");

    //Get Remove from Watchlist button
    const removeFromWatchlistButton = screen.getByLabelText('removeFromWatchlistButton');
    expect(removeFromWatchlistButton).toBeInTheDocument();
  });

  //Test: Remove from Watchlist button: First adds the movie to watchlist and then removes it from the watchlist and shows a toast and the button changes to Add to Watchlist
  test("Remove from Watchlist button: First adds the movie to watchlist and then removes it from the watchlist and shows a toast and the button changes to Add to Watchlist", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });

    //Get Add to Watchlist button
    const addToWatchlistButton = screen.getByLabelText('addToWatchlistButton');
    expect(addToWatchlistButton).toBeInTheDocument();

    //Click Add to Watchlist button
    fireEvent.click(addToWatchlistButton);

    //Wait for the toast to show
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    //Get Snackbar
    const snackbar = screen.getByRole('alert');
    expect(snackbar).toHaveTextContent("Movie added to watchlist");

    //Get Remove from Watchlist button
    const removeFromWatchlistButton = screen.getByLabelText('removeFromWatchlistButton');
    expect(removeFromWatchlistButton).toBeInTheDocument();

    //Click Remove from Watchlist button
    fireEvent.click(removeFromWatchlistButton);

    //Wait for the toast to show
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    //Get Snackbar
    const snackbars = screen.getAllByRole('alert');
    
    //Since multiple toasts check all the possible toasts
    expect(snackbars[1]).toHaveTextContent("Movie removed from watchlist");

    //Get Add to Watchlist button
    const addToWatchlistButton2 = screen.getByLabelText('addToWatchlistButton');
    expect(addToWatchlistButton2).toBeInTheDocument();
  });

});
