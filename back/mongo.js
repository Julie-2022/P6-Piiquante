require("dotenv").config();

const mongoose = require("mongoose");

//console.log("Variable d'environnement:", process.env.DB_URL)
const passwordDB = process.env.DB_PASSWORD;
const userDB = process.env.DB_USER;
const clusterDB = process.env.DB_CLUSTER;
const uri = `mongodb+srv://${userDB}:${passwordDB}@${clusterDB}.s38s1qs.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to Mongo :", err));

module.exports = { mongoose };
