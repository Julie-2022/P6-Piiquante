/****** Server ****/
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

//Middleware (toujours avant les routes)
app.use(cors()); // ajoute les headers /Network. cors est un middleware qui va s'éxecuter entre la req et la rep
app.use(express.json()); // récup la req, on l'interroge et avant d'envoyer la rep il va faire tourner cors

module.exports = { app, express };
