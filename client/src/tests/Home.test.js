import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Home from "../components/Home";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";


jest.mock("@auth0/auth0-react")

jest.mock("react-router-dom", () => {
    return {
        useNavigate: jest.fn(),
        Link: ({ children, ...rest }) => <a {...rest}>{children}</a>, 
    };
})

jest.mock("../AuthTokenContext")

describe("Home Page: Without Auth", () => {
    const mockLoginWithRedirect = jest.fn();
    beforeEach(() => {
        useAuth0.mockReturnValue({
            isLoading: false,
            isAuthenticated: false,
            loginWithRedirect: mockLoginWithRedirect
        })
        useAuthToken.mockReturnValue({
            accessToken: null
        });
    });

    //Test: Home Page without auth should have a Hero section with "Welcome to MovieDB" and a CTA Button
    test("Home Page without auth should have a Hero section with 'Welcome to MovieDB' and a CTA Button", async () => {
        render(<Home />);

        expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        expect(screen.getByText("Welcome to MovieDB")).toBeInTheDocument();
        expect(screen.getByText("Get Started")).toBeInTheDocument();
    });

    //Test: Home Page without auth should not have Watchlist section
    test("Home Page without auth should not have Watchlist section", async () => {
        render(<Home />);

        expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        expect(screen.queryByText("Your Watchlist")).not.toBeInTheDocument();
    });

    //Test: Home Page should have Popular Movies section with 20 Cards
    test("Home Page should have Popular Movies section with 20 Cards", async () => {
        render(<Home />);

        expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        expect(screen.getAllByLabelText("movieCard")).toHaveLength(20);
    });

    //Test: Clicking on the CTA Button should navigate to the Signup Page with loginWithRedirect with screen_hint: "signup"
    test("Clicking on the CTA Button should navigate to the Signup Page with loginWithRedirect with screen_hint: 'signup'", async () => {
        render(<Home />);

        expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        fireEvent.click(screen.getByText("Get Started"));

        expect(mockLoginWithRedirect).toHaveBeenCalledWith({screen_hint: "signup"});
    });

    //Test: Each Movie Card should have a movie button, Title, Average Score, and Poster
    test("Each Movie Card should have a movie button, Title, Average Score, and Poster", async () => {
        render(<Home />);

        expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        const movieCards = screen.getAllByLabelText("movieCard");

        movieCards.forEach((card) => {
            expect(card).toHaveTextContent("View Details");
            expect(card).toHaveTextContent("Release Date");
            expect(card).toHaveTextContent("Rating");
            expect(card).toContainHTML("<img");
        });
    });


});


describe("Home Page: With Auth", () => { 
    const mockUser = {
        name: "John Doe",
        email: "johndoe@example.com",
        picture: "http://example.com/picture.jpg",
        sub: "auth0|123456",
        email_verified: true,
    };

    beforeEach(() => {
        useAuth0.mockReturnValue({
            isLoading: false,
            isAuthenticated: true,
            user: mockUser
        });
        useAuthToken.mockReturnValue({
            accessToken: "fake_token"
        });
        
        global.fetch = jest.fn((url, options) => {
            if (url.includes("popular")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        results: [
                            ...Array.from({ length: 19 }, (_, i) => ({
                                id: i,
                                title: `Movie ${i}`,
                                release_date: "2021-01-01",
                                vote_average: 7.5,
                                poster_path: "/poster.jpg"
                            })),
                            {
                                id: 359410,
                                title: "Road House",
                                release_date: "2024-03-08",
                                vote_average: 7.0,
                                poster_path: "/poster.jpg"
                            }
                        ]
                    })
                });
            } else if(
                url.includes("watchlist") && 
                options.method === "GET"
            ) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        {
                            "id": 5,
                            "auth0Id": "google-oauth2|00110000000000",
                            "movieId": 1011985
                        }
                    ])
                });
            } else if(
                url === 'https://api.themoviedb.org/3/movie/1011985?api_key=034e14c6f2ab0e0ccfeea2a32339ffe3'
              ) {
                return Promise.resolve({
                  ok: true,
                  json: () => Promise.resolve({
                    title: "Kung Fu Panda 4",
                    vote_average: 7.1,
                    release_date: "2024-03-02",
                    poster_path: "/poster.jpg",
                  }),
                });
              }
        });
    });
    

    //Test: Home Page with auth renders without crashing
    test("Home Page with auth renders without crashing", async () => {
        render(<Home />);

        expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        expect(screen.getByText("MovieDB")).toBeInTheDocument();
    });

    //Test: Home Page with auth should have Watchlist section
    test("Home Page with auth should have Watchlist section", async () => {
        render(<Home />);

        expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        expect(screen.getByText("Your Watchlist")).toBeInTheDocument();
    });

    //Test: The Watchlist section should have a movie card with the movie details with title Kung Fu Panda 4
    test("The Watchlist section should have a movie card with the movie details with title Kung Fu Panda 4", async () => {
        render(<Home />);

        expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        //Check if watchlist card is rendered
        expect(screen.getByLabelText("watchlistCard")).toBeInTheDocument();

        //First get all watchlist card with watchlistCard label
        const watchlistCard = screen.getAllByLabelText("watchlistCard");

        //Check if the watchlistCard has the title Kung Fu Panda 4
        expect(watchlistCard[0]).toHaveTextContent("Kung Fu Panda 4");

    });

    //Test: The Hero Section Should not be rendered instead there should be carousel
    test("The Hero Section Should not be rendered instead there should be carousel", async () => {
        render(<Home />);

        expect(screen.getByLabelText('loadingSpinner')).toBeInTheDocument();

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        expect(screen.queryByText("Welcome to MovieDB")).not.toBeInTheDocument();
        expect(screen.getByTestId("carousel")).toBeInTheDocument();
    });
});