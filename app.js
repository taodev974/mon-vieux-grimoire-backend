const express = require("express");
const app = express();

// Middleware JSON
app.use(express.json());

// IMPORT DES ROUTES
const booksRoutes = require("./routes/books");

// UTILISATION DES ROUTES
app.use("/api/books", booksRoutes);

const userRoutes = require("./routes/user");
app.use("/api/auth", userRoutes);

// Route test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend OK !" });
});

module.exports = app;
