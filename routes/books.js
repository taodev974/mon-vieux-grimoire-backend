const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const optimizeImage = require("../middleware/optimize-image");

const booksCtrl = require("../controllers/books");

// Route des 3 meilleurs livres
router.get("/bestrating", booksCtrl.getBestRating);

// Récupérer tous les livres
router.get("/", booksCtrl.getAllBooks);

// Récupérer un livre par ID
router.get("/:id", booksCtrl.getBook);

// Créer un livre (auth → upload → optimisation → création)
router.post("/", auth, multer, optimizeImage, booksCtrl.createBook);

// Modifier un livre
router.put("/:id", auth, multer, optimizeImage, booksCtrl.modifyBook);

// Supprimer un livre
router.delete("/:id", auth, booksCtrl.deleteBook);

// Noter un livre
router.post("/:id/rating", auth, booksCtrl.rateBook);

module.exports = router;
