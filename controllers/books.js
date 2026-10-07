const Book = require("../models/Book");

exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getBook = (req, res) => {
  // @TODO: Récupérer le livre par son ID via le paramètre de requête.
};

exports.createBook = (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);

    console.log("Livre reçu pour publication:", bookObject);

    // Création du livre avec les données reçues dans MongoDB:
    // Création d'un document MongoDB:
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      averageRating: 0,
      ratings: [],
    });

    // Sauvegarde du livre dans la base de données MongoDB:
    book
      .save()
      .then(() => res.status(201).json({ message: "Livre créé !" }))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    res.status(400).json({ error });
  }
};

const fs = require("fs");

exports.modifyBook = (req, res) => {
  const bookId = req.params.id;

  // Cas 1 : nouvelle image envoyée
  const newBookData = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : {
        ...req.body,
      };

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Vérification de l'utilisateur
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: "Requête non autorisée" });
      }

      // Cas 2 : nouvelle image → supprimer l'ancienne
      if (req.file) {
        const oldFilename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${oldFilename}`, () => {});
      }

      // Mise à jour du livre
      Book.updateOne({ _id: bookId }, { ...newBookData, _id: bookId })
        .then(() => res.status(200).json({ message: "Livre modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteBook = (req, res) => {
  const bookId = req.params.id;

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: "Requête non autorisée" });
      }

      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: bookId })
          .then(() => res.status(200).json({ message: "Livre supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.rateBook = (req, res) => {
  const bookId = req.params.id;
  const userId = req.auth.userId;
  const rating = req.body.rating;

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      const alreadyRated = book.ratings.find((r) => r.userId === userId);
      if (alreadyRated) {
        return res
          .status(400)
          .json({ message: "Vous avez déjà noté ce livre" });
      }

      book.ratings.push({ userId, grade: rating });

      const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = total / book.ratings.length;

      book
        .save()
        .then(() => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
