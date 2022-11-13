/****** Server ****/
require('dotenv').config()
const express = require("express");
const app = express();
const cors = require("cors")

//Middleware
app.use(cors()) // ajoute les headers /Network
app.use(express.json())

module.exports = {app, express}