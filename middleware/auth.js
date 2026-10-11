const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Récupération du token dans le header Authorization
    const token = req.headers.authorization.split(" ")[1]; // Split entre "Bearer" et le token

    // Vérification du token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Extraction du userId du token
    req.auth = { userId: decodedToken.userId };

    // Log de l'authentification réussie:
    console.log("Authentification réussie pour le user:", decodedToken.userId);

    next(); // On passe à la suite (route ou middleware suivant)
  } catch (error) {
    res.status(401).json({ error: "Requête non authentifiée !" });
  }
};
