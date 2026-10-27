const express = require("express");
const usersRoutes = require("./routes/users.routes");

const app = express();

app.use(express.json());

// Root endpoint - API documentation & status
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

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Mount user routes
app.use("/users", usersRoutes);

module.exports = app;
