# The Movie Database App

This is a one stop app to get all the information about your favorite movies. You can search for movies, view their details, read reviews and much more. You can add movies to your watchlist and then watch them later.

You can recommend movies to other users and also see the recommendations given by other users.

## Features

- Search for movies
- View movie details
- Read reviews
- Add movies to watchlist
- Recommend movies to other users
- View recommendations given by other users
- View popular movies

## Tech Stack

- Frontend:
    - React
    - Tailwind CSS

- Backend:
    - Node.js
    - Express
    - MySQL (Prisma)

- API:
    - The Movie Database API

- Authentication:
    - Auth0

## User Flow

1. Anyone without an account can search for movies, view movie details, read reviews and view popular movies.
2. To add movies to watchlist, recommend movies to other users and view recommendations given by other users, the user needs to create an account.
3. From the home page, unauthenticated users can view popular movies and if they want they login or create an account.
4. Authenticated users can see a carousel of popular movies, their watchlist is shown on the home page as well.
5. When a user navigates to a movie details page, they can see the movie details, reviews and recommendations. But to add movies to watchlist, recommend movies to other users and view recommendations given by other users, the user needs to be authenticated.
6. On the auth debugger page the authenticated user can check their credentials.
7. When authenticated users navigate to the profile page, they can make changes to their name and email. They also can manage their review and recommendations.

## Hosting
 
 The website has been hosted on Vercel and can be accessed [here](https://movie-database-app.vercel.app/).

