const Book = require("../models/Book");
const fs = require("fs");

// Récupérer tous les livres
exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Récupérer un livre par ID
exports.getBook = (req, res) => {
  Book.findById(req.params.id)
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Créer un livre
exports.createBook = (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);

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

// Modifier un livre
exports.modifyBook = (req, res, next) => {
  const bookId = req.params.id;

  // Vérifier si une nouvelle image est uploadée
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };

  // Empêcher la modification du userId
  delete bookObject.userId;

  // Empêcher la modification de averageRating
  delete bookObject.averageRating;

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Vérifier que l'utilisateur est bien le propriétaire
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: "Requête non autorisée" });
      }

      // Si nouvelle image → supprimer l'ancienne
      if (req.file) {
        const oldFilename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${oldFilename}`, () => {});
      }

      // Mise à jour du livre
      Book.updateOne({ _id: bookId }, { ...bookObject, _id: bookId })
        .then(() => res.status(200).json({ message: "Livre modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Book.findByIdAndDelete(req.params.id)
          .then(() => res.status(200).json({ message: "Livre supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Noter un livre
exports.rateBook = (req, res) => {
  const rating = {
    userId: req.auth.userId,
    grade: req.body.rating,
  };

  Book.findById(req.params.id)
    .then((book) => {
      book.ratings.push(rating);

      // Recalcul de la note moyenne
      const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = total / book.ratings.length;

      book
        .save()
        .then(() => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};

// Les 3 livres les mieux notés
exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
