const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// Permet de gérer les requêtes CORS et de logger les requêtes HTTP.
app.use(cors());
// Permet de logger les requêtes HTTP.
app.use(morgan())
// Permet de parser les requêtes JSON.
app.use(express.json());
// Exposition des images publiquement:
app.use("/images", express.static(__dirname + "/images"));

// IMPORT DES ROUTES
const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

// UTILISATION DES ROUTES
app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);

// Route test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend OK !" });
});

module.exports = app;
