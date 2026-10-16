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
    await sharp(originalPath)
      .resize({
        width: 1024,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(optimizedPath);

    // Mise à jour du fichier dans req.file
    req.file.filename = optimizedName;
    req.file.path = optimizedPath;

    next();
  } catch (error) {
    console.error("Erreur Sharp:", error);
    next(error); // IMPORTANT : pas de res.status()
  }
};
