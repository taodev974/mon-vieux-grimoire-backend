const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books");
const auth = require("../middleware/auth");

router.get("/", booksCtrl.getAllBooks);
router.post("/", auth, booksCtrl.createBook);
router.put("/:id", auth, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.post("/:id/rating", auth, booksCtrl.rateBook);

module.exports = router;
