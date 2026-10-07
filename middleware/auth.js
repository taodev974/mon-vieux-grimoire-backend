const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Split entre "Bearer" et le token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { userId: decodedToken.userId };

    // Log de l'authentification réussie:
    console.log("Authentification réussie pour le user:", decodedToken.userId)
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Requête non authentifiée !" });
  }
};
