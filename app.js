const express = require("express");
const app = express();
const cors = require("cors"); //Autorise le frontend à parler
const morgan = require("morgan");

// Middlewares globaux
//Permet de gérer les reqêtes CORS
app.use(cors()); // Sans ça, le frontend est bloqué
//Permet de logger les reqêtes HTTP
app.use(morgan("dev")); // Affiche les requêtes dans le terminal
// Permet de parser les requêtes JSON
app.use(express.json()); // Permet de lire le JSON envoyé par le frontend

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
