const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to InstaLite API",
    status: "running",
    endpoints: {
      health: "GET /health",
      users: "GET /users",
      posts: "GET /posts",
    },
  });
});


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

module.exports = app;
