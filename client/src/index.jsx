import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import { Auth0Provider } from "@auth0/auth0-react";
import VerifyUser from "./components/VerifyUser";
import { AuthTokenProvider } from "./AuthTokenContext";
import RecommendationPage from "./components/RecommendationPage/RecommendationPage";
import './styles.css';
import MoviePage from "./components/MoviePage";
import Profile from "./components/Profile";
import AuthDebugger from "./components/AuthDebugger";
import SearchPage from "./components/SearchBar/SearchPage";

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

const requestedScopes = ["profile", "email"];

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/movies/:movieId" element={<MoviePage />} />
            <Route path="/recommendations/:movieId" element={<RecommendationPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/authDebugger" element={<AuthDebugger />} />
            <Route path="/search" element={<SearchPage/>} />
            <Route path="/search/:query" element={<SearchPage/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
