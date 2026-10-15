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

    // Redimension + conversion WebP
    await sharp(originalPath)
      .resize({
        width: 1024, // ou 800 selon ton front
        height: 1024,
        fit: "cover",
      })
      .webp({ quality: 80 })
      .toFile(optimizedPath);

    // Suppression du fichier original
    fs.unlinkSync(originalPath);

    // Mise à jour du nom du fichier dans req.file
    req.file.filename = optimizedName;
    req.file.path = optimizedPath;

    next();
  } catch (error) {
    console.error("Erreur optimisation image :", error);

    // Supprimer le fichier original en cas d'échec
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: "Erreur lors de l'optimisation de l'image" });
  }
};
