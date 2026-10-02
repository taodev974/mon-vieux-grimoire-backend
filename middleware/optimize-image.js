const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = async (req, res, next) => {
  if (!req.file) return next();

  const filePath = req.file.path;
  const optimizedPath = path.join(
    "images",
    req.file.filename.split(".")[0] + ".webp",
  );

  try {
    await sharp(filePath).webp({ quality: 80 }).toFile(optimizedPath);

    fs.unlinkSync(filePath); // supprime l'image originale

    req.file.filename = req.file.filename.split(".")[0] + ".webp";
    next();
  } catch (error) {
    console.error("Erreur optimisation image :", error);
    next(error);
  }
};
