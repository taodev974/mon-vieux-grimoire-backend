const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = async (req, res, next) => {
  if (!req.file) {
    return next(); // Si pas d'image, on passe au contrôleur
  }
  console.log("Fichier d'image à optimiser:", req.file.filename);
  try {
    // Chemin du fichier original
    const originalPath = req.file.path;

    // Nouveau nom en .webp
    const optimizedName = req.file.filename.split(".")[0] + ".webp";

    // Chemin du fichier optimisé
    const optimizedPath = path.join("images", optimizedName);

    // Conversion en WebP
    await sharp(originalPath).webp({ quality: 80 }).toFile(optimizedPath);

    // Suppression du fichier original
    fs.unlinkSync(originalPath);

    // Mise à jour du nom du fichier dans req.file
    req.file.filename = optimizedName;
    req.file.path = optimizedPath;

    next();
  } catch (error) {
    console.error("Erreur optimisation image :", error);
    res.status(500).json({ error: "Erreur lors de l'optimisation de l'image" });
  }
};
