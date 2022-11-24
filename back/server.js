/****** Server ****/
const express = require("express");
const app = express(); //donne accés au corps de la req (req.body)
const cors = require("cors");
const helmet = require("helmet");

// Middleware (toujours avant les routes)
//sécurisation des en-têtes HTTP
app.use(
  helmet({
    crossOriginResourcePolicy: false, //pour les images
  })
);
//Active CORS pour éviter les attaques CSRF
app.use(
  cors({
    //app.use(cors());
    origin: "http://localhost:4200",
  })
); // ajoute les headers /Network. cors est un middleware qui va s'éxecuter entre la req et la rep
app.use(express.json()); // récup la req, on l'interroge et avant d'envoyer la rep il va faire tourner cors

module.exports = { app, express };
