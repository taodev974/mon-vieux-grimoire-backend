const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const optimizeImage = require("../middleware/optimize-image");

router.get("/", booksCtrl.getAllBooks);
router.post("/", auth, booksCtrl.createBook);
router.put("/:id", auth, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.post("/:id/rating", auth, booksCtrl.rateBook);
router.post("/", auth, multer, optimizeImage, booksCtrl.createBook);
router.put("/:id", auth, multer, optimizeImage, booksCtrl.modifyBook);

module.exports = router;
