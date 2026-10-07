const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = async (req, res, next) => {
  if (!req.file) return next();
  
  console.log("Fichier d'image à optimiser:", req.file.filename)

  const filePath = req.file.path;
  // Retire uniquement la dernière extension, pour conserver le timestamp ajouté par multer
  const optimizedName = path.parse(req.file.filename).name + ".webp";
  const optimizedPath = path.join("images", optimizedName);

  try {
    // Optimise l'image en format WebP avec une qualité de 80%:
    await sharp(filePath).webp({ quality: 80 }).toFile(optimizedPath);

    // Supprime le fichier d'origine après optimisation:
    fs.unlinkSync(filePath);

    // Met à jour le nom du fichier dans la requête pour qu'il pointe vers l'image optimisée:
    req.file.filename = optimizedName;
    next();
  } catch (error) {
    res.status(500).json({ message: "Erreur optimisation de l'image" });
  }
};
