const express = require("express");
const app = express();

// Middleware JSON
app.use(express.json());

// Route test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend OK !" });
});

module.exports = app;
