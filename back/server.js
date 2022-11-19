/****** Server ****/
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");

// Middleware (toujours avant les routes)
//sécurisation des en-têtes HTTP
///app.use(helmet()); // ++
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
  //helmet.crossOriginResourcePolicy({
  //policy: "cross-origin", // pour afficher les images sur le site, cela enlève ces paramètres de sécurité : same-site | same-origin
  //})
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
