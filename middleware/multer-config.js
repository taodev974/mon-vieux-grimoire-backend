const multer = require("multer");
const path = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Multer associe le fichier d'image à la requête (req.file) en utilisant le stockage configuré:
const storage = multer.diskStorage({
  // Le dossier de destination pour les fichiers d'image:
  destination: "images",
  // Le nom du fichier d'image:
  filename: (req, file, callback) => {
    const name = path.parse(file.originalname).name.split(" ").join("_"); // Remplace les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype];
    
    // Génère un nom de fichier unique (avec la date) pour éviter les conflits au format "timestamp-nom.extension":
    callback(null, Date.now() + "-" + name + "." + extension);
  }
});

module.exports = multer({ storage }).single("image");
