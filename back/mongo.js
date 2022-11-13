/********** Données de MongoDB */
// mongodb+srv://user_1:<password>@cluster0.1kjbg2l.mongodb.net/?retryWrites=true&w=majority

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://user_1:<password>@cluster0.1kjbg2l.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
/************ MongoDB 2ème essai */
//Piquante MP: MongoSauce
//mongodb+srv://user_1:<password>@piquante.s38s1qs.mongodb.net/?retryWrites=true&w=majority
//Database (user_1) MP: MongoDBP6

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const dotenv = require("dotenv");
//require('dotenv').config()
dotenv.config({ path: "./controllers/.env" });

//console.log("Variable d'environnement:", process.env.DB_URL)
const uri = process.env.DB_URL;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to Mongo :", err));

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = { mongoose, User };
