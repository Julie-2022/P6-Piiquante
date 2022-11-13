const { User } = require("../mongo"); //car User renvoie un objet
const bcrypt = require("bcrypt"); // crypt mot de pass
//const { is } = require("express/lib/request");
const jwt = require("jsonwebtoken");
//const bruteForce = require("bruteforcejs")

async function createUser(req, res) {
  try {
    const { email, password } = req.body;
    //console.log({ email, password });
    const hashedPassword = await hashPassword(password);
    //console.log("password: ", password);console.log("hashedpassword: ", hashedPassword);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    //réponse de Bd
    res.status(201).send({ message: "utilisateur enregistré !" });
    //return console.log("User enregistré !", res)
  } catch (err) {
    res.status(409).send({ message: "Utilisateur pas enregistré :" + err });
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
    //User.findOne({email: email}).then(console.log) / return 1 objet User
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(403).send({ message: "Mot de passe incorrect" });
    }
    const token = createToken(email);
    res
      .status(200)
      .send({ message: "Connexion réussie", userId: user?._id, token: token });
    //console.log("user :", user);console.log("isValidPassword :", isValidPassword);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Erreur interne" });
  }
}

function createToken(email) {
  const jwtPassword = process.env.JWT_PASSWORD;
  return jwt.sign({ email: email }, jwtPassword, { expiresIn: "24h" }); //test 1000ms 
}

/**** Pour vider la Bd */
//User.deleteMany({}).then(() => console.log("all removed"))
module.exports = { createUser, logUser };




// jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1bHl6ZWJkYTEyM0B5YWhvby5mciIsImlhdCI6MTY2ODA3MjgxNSwiZXhwIjoxNjY4MDcyODE2fQ.s1quOEjp1I0xPEgiTxRdhgpnRyN7FOJxBqPvhA_8APY",
//  function verif (err, decode) {
//      if(err) {
//          console.error("ERROR :", err)
//     } else {
//          console.log("DECODED :", decode)
//         }
//     }