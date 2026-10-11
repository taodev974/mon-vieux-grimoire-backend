const multer = require("multer");
const path = require("path");

// Dictionnaire des extensions acceptées
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Configuration du stockage
// Multer associe le fichier d'image à la requête (req.file) en utilisant le stockage configuré:
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // dossier où Multer dépose les fichiers
  },
  // Le nom du fichier d'image:
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_").split(".")[0]; // Remplace les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype] || "jpg";
    callback(null, name + Date.now() + "." + extension);
  },
});

// Export du middleware
module.exports = multer({ storage }).single("image");
