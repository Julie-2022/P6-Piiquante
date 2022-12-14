const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Modèle user
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Plugin qui restreint à une création de user par e-mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
