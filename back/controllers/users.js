const User = require("../models/users"); //car User renvoie un objet
const bcrypt = require("bcrypt"); // crypt mot de pass
const jwt = require("jsonwebtoken");
//const bruteForce = require("bruteforcejs")
const validator = require("validator");

async function createUser(req, res) {
  const { email, password } = req.body;
  if (validator.isEmail(email) == false) {
    return res
      .status(400)
      .send({ message: "l'e-mail n'est pas valide :", email });
  }
  if (validator.isStrongPassword(password) == false) {
    // enlever les espaces pour plus de sécurité
    return res
      .status(400)
      .send({ message: "Mot de passe pas assez fort :", password });
  }
  try {
    const hashedPassword = await hashPassword(password);
    //console.log("password: ", password);console.log("hashedpassword: ", hashedPassword);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    //réponse de Bd
    return res.status(201).send({ message: "utilisateur enregistré !" });
    //return console.log("User enregistré !", res)
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Utilisateur pas enregistré :" + err });
  }
}

function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function logUser(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    //Trouver email
    const user = await User.findOne({ email: email });
    //Vérif password
    User.findOne({ email: email }).then(console.log); // return 1 objet User
    //console.log({ password });
    //console.log("req.body.password", req.body.password);
    const isValidPassword = await bcrypt.compare(password, user.password);
    //console.log({ password });

    if (!isValidPassword) {
      return res.status(401).send({ message: "Mot de passe incorrect" });
    }
    const token = createToken(email);
    res
      .status(200)
      .send({ message: "Connexion réussie", userId: user?._id, token: token });
    //console.log("user :", user);console.log("isValidPassword :", isValidPassword);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Erreur interne" });
  }
}

function createToken(email) {
  const jwtPassword = process.env.JWT_PASSWORD;
  return jwt.sign({ email: email }, jwtPassword, { expiresIn: "24h" }); // test 1000ms
}

//User.deleteMany({}).then(() => console.log("all removed"))
module.exports = { createUser, logUser };
