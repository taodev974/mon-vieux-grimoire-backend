const Book = require("../models/Book");
const fs = require("fs");
const mongoose = require("mongoose");

// Récupérer tous les livres
exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Récupérer un livre par ID
exports.getBook = (req, res) => {
  const bookId = req.params.id;

  // Vérifier que l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }
  Book.findById(req.params.id)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
      res.status(200).json(book);
    })
    .catch((error) => res.status(500).json({ error }));
};

// Créer un livre
exports.createBook = (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);

    // Récupérer la note initiale envoyée par le front
    const initialRating = bookObject.ratings?.[0]?.grade || null;

    // Création du livre avec les données reçues dans MongoDB:
    // Création d'un document MongoDB:
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      ratings: initialRating
        ? [{ userId: req.auth.userId, grade: initialRating }]
        : [],
      averageRating: initialRating || 0,
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

  // Empêcher la modification de averageRating
  delete bookObject.ratings;

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (!book) {
        // Si une image brute a été uploadée → la supprimer
        if (req.file && req.file.originalPath) {
          fs.unlink(req.file.originalPath, () => {});
        }
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Vérifier que l'utilisateur est bien le propriétaire
      if (book.userId !== req.auth.userId) {
        // Supprimer l'image brute uploadée
        if (req.file && req.file.originalPath) {
          fs.unlink(req.file.originalPath, () => {});
        }
        return res.status(403).json({ message: "Requête non autorisée" });
      }

      // Si nouvelle image → supprimer l'ancienne
      if (req.file) {
        const oldFilename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${oldFilename}`, () => {});
      }

      // Mise à jour du livre
      Book.updateOne({ _id: bookId }, { ...bookObject, _id: bookId })
        .then(() => {
          // Supprimer l'image brute uploadée après succès
          if (req.file && req.file.originalPath) {
            fs.unlink(req.file.originalPath, () => {});
          }
          res.status(200).json({ message: "Livre modifié !" });
        })
        .catch((error) => {
          // Supprimer l'image brute uploadée en cas d'erreur
          if (req.file && req.file.originalPath) {
            fs.unlink(req.file.originalPath, () => {});
          }
          res.status(400).json({ error });
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
  const bookId = req.params.id;

  // Vérifier que l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Vérifier que l'utilisateur est bien le propriétaire
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: "Requête non autorisée" });
      }

      // Supprimer l'image optimisée associée au livre
      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        // Supprimer le livre
        Book.deleteOne({ _id: bookId })
          .then(() => res.status(200).json({ message: "Livre supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Noter un livre
exports.rateBook = (req, res, next) => {
  const bookId = req.params.id;
  const userId = req.auth.userId;
  const grade = req.body.rating;

  // Vérifier que l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(404).json({ message: "Livre non trouvé" });
  }

  // Vérifier que la note est correcte
  if (grade < 0 || grade > 5) {
    return res
      .status(400)
      .json({ message: "La note doit être comprise entre 0 et 5" });
  }

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Vérifier que l'utilisateur n'a pas déjà noté ce livre
      if (book.ratings.some((r) => r.userId.toString() === userId)) {
        return res
          .status(400)
          .json({ message: "Vous avez déjà noté ce livre" });
      }

      // Ajouter la nouvelle note
      book.ratings.push({ userId: userId, grade: grade });

      // Recalculer la moyenne
      const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
      book.averageRating = total / book.ratings.length;

      // Sauvegarder
      book
        .save()
        .then((updatedBook) => res.status(200).json(updatedBook))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Les 3 livres les mieux notés
exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
