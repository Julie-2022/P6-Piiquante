const jwt = require("jsonwebtoken")

function authenticateUser(req, res, next) {
    console.log("Authenticate User")
    const header = req.header("Authorization")
    //couper au niveau des espaces pour récup que le token dans Headers de sauces /Network
    //console.log("header :",  header)
    if(header == null) return res.status(403).send({message: "Invalid"})
    
    const token = header.split(' ')[1];
    if(token == null) res.status(403).send({ message: "Token is null or undefined"})


    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
        if(err) return res.status(403).send({ message: "Token invalid" + err})//s'arrête là si err
        console.log("Le Token est bien valide, next")
        next()
    })
    //console.log("token :", token)
    //console.log("decoded :", decoded)
}

module.exports = {authenticateUser}