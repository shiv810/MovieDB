import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

// add your endpoints below this line

// Users

//GET: /users/:auth0Id - Get a user by their auth0Id (requires authentication)
app.get("/users/:auth0Id", requireAuth, async (req, res) => {
  const { auth0Id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  res.json(user);
});

//PUT: /users/:auth0Id - Update a user by their auth0Id (requires authentication)
app.put("/users/:auth0Id", requireAuth, async (req, res) => {
  const { auth0Id } = req.params;
  const { name, email } = req.body;

  const user = await prisma.user.update({
    where: {
      auth0Id,
    },
    data: {
      name,
      email,
    },
  });

  res.json(user);
});


// Review

//GET: /reviews/:movieId - Get all reviews for a movie
app.get("/reviews/:movieId", async (req, res) => {
  const { movieId } = req.params;
  const reviews = await prisma.review.findMany({
    where: {
      movieId: parseInt(movieId),
    },
  });

  //For the output we need time, stars, content, and user
  const reviewsWithUsers = await Promise.all(
    reviews.map(async (review) => {
      const user = await prisma.user.findUnique({
        where: {
          auth0Id: review.auth0Id,
        },
      });

      return {
        time: review.createdAt,
        stars: review.stars,
        content: review.review,
        user: user.email,
      };
    })
  );
  res.json(reviewsWithUsers);
});

//POST: /reviews - Create a new review (requires authentication)
app.post("/reviews", requireAuth, async (req, res) => {
  const { movieId, text, stars } = req.body;

  const review = await prisma.review.create({
    data: {
      review: text,
      stars,
      movieId,
      auth0Id: req.auth.payload.sub
    },
  });

  res.json(review);
});

//GET: /reviews/:auth0Id - Get all reviews made by a user
app.get("/user/reviews/:auth0Id", requireAuth, async (req, res) => {
  const { auth0Id } = req.params;
  const reviews = await prisma.review.findMany({
    where: {
      auth0Id,
    },
  });
  res.json(reviews);
});

// PUT: /reviews/:reviewId - Update a review (requires authentication)
app.put("/reviews/:reviewId", requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { text, stars } = req.body;

  const review = await prisma.review.update({
    where: {
      id: parseInt(reviewId),
    },
    data: {
      review: text,
      stars,
    },
  });

  res.json(review);
});

// DELETE: /reviews/:reviewId - Delete a review (requires authentication)
app.delete("/reviews/:reviewId", requireAuth, async (req, res) => {
  const { reviewId } = req.params;

  const review = await prisma.review.delete({
    where: {
      id: parseInt(reviewId),
    },
  });

  res.json(review);
});


// Recommendations

//GET: /recommendations/:movieId - Get all recommendations for a movie
app.get("/recommendations/:movieId", async (req, res) => {
  const { movieId } = req.params;
  const recommendations = await prisma.recommendation.findMany({
    where: {
      movieIdParent: parseInt(movieId),
    },
  });

  //For the output we need user title and comment
  const recommendationsWithUsers = await Promise.all(
    recommendations.map(async (recommendation) => {
      const user = await prisma.user.findUnique({
        where: {
          auth0Id: recommendation.auth0Id,
        },
      });

      return {
        ...recommendation,
        user: user.email,
        title: recommendation.comment,
      };
    })
  );

  res.json(recommendationsWithUsers);
});

//POST: /recommendations - Create a new recommendation (requires authentication)
app.post("/recommendations", requireAuth, async (req, res) => {
  const { movieIdParent, movieIdRecommend, comment } = req.body;
  const recommendation = await prisma.recommendation.create({
    data: {
      comment,
      movieIdParent,
      movieIdRecommend,
      auth0Id: req.auth.payload.sub,
    },
  });

  res.json(recommendation);
});

//GET: /recommendations/:auth0Id - Get all recommendations made by a user
app.get("/user/recommendations/:auth0Id", requireAuth, async (req, res) => {
  const { auth0Id } = req.params;
  const recommendations = await prisma.recommendation.findMany({
    where: {
      auth0Id,
    },
  });

  res.json(recommendations);
});

// DELETE: /recommendations/:recommendationId - Delete a recommendation (requires authentication)
app.delete("/recommendations/:recommendationId", requireAuth, async (req, res) => {
  const { recommendationId } = req.params;

  const recommendation = await prisma.recommendation.delete({
    where: {
      id: parseInt(recommendationId),
    },
  });

  res.json(recommendation);
});


// Watchlist

//GET: /watchlist - Get all movies in the watchlist for the user
app.get("/watchlist", requireAuth, async (req, res) => {
  const watchlist = await prisma.watchListItem.findMany({
    where: {
      auth0Id: req.auth.payload.sub,
    },
  });

  res.json(watchlist);
});

//POST: /watchlist - Add a movie to the watchlist for the user
app.post("/watchlist", requireAuth, async (req, res) => {
  const { movieId } = req.body;
  const watchlistItem = await prisma.watchListItem.create({
    data: {
      movieId,
      auth0Id: req.auth.payload.sub,
    },
  });

  res.json(watchlistItem);
});

//DELETE: /watchlist/:movieId - Remove a movie from the watchlist for the user
app.delete("/watchlist/:movieId", requireAuth, async (req, res) => {
  const { movieId } = req.params;
  const watchlistItem = await prisma.watchListItem.deleteMany({
    where: {
      movieId: parseInt(movieId),
      auth0Id: req.auth.payload.sub,
    },
  });

  res.json(watchlistItem);
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
