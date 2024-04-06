import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MovieDetails from "./MovieDetails";

jest.mock("@auth0/auth0-react", () => ({
    useAuth0: () => ({
      isLoading: false,
    }),
  }));

  jest.mock("../../AuthTokenContext", () => ({
    useAuthToken: () => ({
      accessToken: "",
    }),
  }));

  jest.mock("react-router-dom", () => ({
    useNavigate: () => jest.fn(),
  }));

describe("MovieDetails component: Title", () => {
  test("renders movie details correctly", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
    });

    const originalTitle = () => screen.queryByText("Kung Fu Panda 4");
    expect(originalTitle()).toBeInTheDocument();

  });
});

describe("MovieDetails component: Overview", () => {
  test("renders movie details correctly", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
    });

    const overview = () => screen.queryByText("Po and the Furious Five uncover the legend of three of kung fu's greatest heroes: Master Thundering Rhino, Master Storming Ox, and Master Croc.");
    expect(overview()).toBeInTheDocument();

  });
});

describe("MovieDetails component: Release Date", () => {
  test("renders movie details correctly", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
    });

    const releaseDate = () => screen.queryByText("2024-03-02");
    expect(releaseDate()).toBeInTheDocument();

  });
});

describe("MovieDetails component: Runtime", () => {
  test("renders movie details correctly", async () => {
    const movieId = 1011985;
    render(<MovieDetails movieId={movieId} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
    });

    const runtime = () => screen.queryByText("1hr 34min");
    expect(runtime()).toBeInTheDocument();

  });
});
