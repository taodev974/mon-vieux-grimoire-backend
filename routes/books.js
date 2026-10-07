const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const optimizeImage = require("../middleware/optimize-image");

router.get("/", booksCtrl.getAllBooks);
// @TODO: router.get("/:id", booksCtrl.getBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.post("/:id/rating", auth, booksCtrl.rateBook);

// Passe d'abord dans le middleware d'authentification (./middleware/auth.js)
// Puis dans le middleware de multer pour gérer le fichier d'image (./middleware/multer-config.js)
// Et enfin dans le middleware d'optimisation d'image (./middleware/optimize-image.js)
// Puis dans le contrôleur pour créer le livre (./controllers/books.js)
router.post("/", auth, multer, optimizeImage, booksCtrl.createBook);
router.put("/:id", auth, multer, optimizeImage, booksCtrl.modifyBook);

module.exports = router;
