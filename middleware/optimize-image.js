const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res, next) => {
  if (!req.file) return next();

  const originalPath = req.file.path;

  // Nouveau nom avec suffixe
  const optimizedName = req.file.filename.split(".")[0] + "-optimized.webp";
  const optimizedPath = path.join("images", optimizedName);

  try {
    // Conversion + optimisation
    await sharp(originalPath)
      .resize({
        width: 1024,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(optimizedPath);

    // Suppression du fichier original
    fs.unlink(originalPath, (err) => {
      if (err) console.error("Erreur suppression fichier original :", err);
    });

    // Mise à jour du fichier dans req.file
    req.file.filename = optimizedName;
    req.file.path = optimizedPath;
    req.file.originalPath = originalPath;

    next();
  } catch (error) {
    console.error("Erreur Sharp:", error);

    // Suppression du fichier original en cas d'erreur
    if (fs.existsSync(originalPath)) {
      fs.unlink(originalPath, () => {});
    }

    // Réponse JSON
    return res.status(500).json({
      error: "Erreur lors de l'optimisation de l'image",
    });
  }
};
