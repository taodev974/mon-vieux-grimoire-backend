const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();
console.log("MONGO_URI =", process.env.MONGO_URI);

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée :", error));

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT || "4000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") throw error;
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
