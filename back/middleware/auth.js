const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  const header = req.header("Authorization");
  //console.log("header :", header);
  if (header == null) return res.status(401).send({ message: "Invalid" });

  const token = header.split(" ")[1]; //couper au niveau des espaces pour récup que le token dans les Headers "Authorization"
  if (token == null)
    res.status(403).send({ message: "Token is null or undefined" });

  jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Token invalid" + err }); //s'arrête là si err
    //console.log("Le Token est bien valide, next")
    next();
  });
}

module.exports = { authenticateUser };

// jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1bHl6ZWJkYTEyM0B5YWhvby5mciIsImlhdCI6MTY2ODA3MjgxNSwiZXhwIjoxNjY4MDcyODE2fQ.s1quOEjp1I0xPEgiTxRdhgpnRyN7FOJxBqPvhA_8APY",
//  function verif (err, decode) {
//      if(err) {
//          console.error("ERROR :", err)
//     } else {
//          console.log("DECODED :", decode)
//         }
//     }

//console.log("token :", token)
//console.log("decoded :", decoded)
