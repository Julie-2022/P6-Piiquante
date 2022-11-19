const mongoose = require("mongoose");
//const { unlink } = require("fs");
const { unlink } = require("fs/promises");
const { nextTick } = require("process");
//const { likeSauce } = require("./vote");

const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  mainPepper: String,
  imageUrl: String,
  heat: Number,
  likes: Number,
  dislikes: Number,
  usersLiked: [String],
  usersDisliked: [String],
});
const Product = mongoose.model("Product", productSchema);

function getSauces(req, res) {
  console.log("Le token a été validé, nous sommes dans getSauces");
  ///Product.deleteMany({}).then(console.log).catch(console.error)
  Product.find({})
    .then((products) => res.send(products))
    .catch((error) => res.status(500).send(error));
}

function getSauce(req, res) {
  console.log("Request Id:", req.params.id); // au clique sur sauce on récup l'Id
  const { id } = req.params; // === id = req.params.id
  return Product.findById(id); //console.log("Le produit avec cet Id :", product) //== .then(console.log)
}

function getSauceById(req, res) {
  getSauce(req, res)
    .then((product) => sendClientResponse(product, res))
    .catch((error) => res.status(500).send(error));
}

function deleteSauce(req, res) {
  const { id } = req.params;
  Product.findByIdAndDelete(id)
    .then((product) => sendClientResponse(product, res))
    .then((item) => deleteImage(item))
    .then((res) => console.log("FILE DELETED", res))
    .catch((err) => res.status(500).send({ message: err }));
}

function deleteImage(product) {
  console.log("DELETE IMAGE", product);
  const imageToDelete = product.imageUrl.split("/").at(-1);
  return unlink("images/" + imageToDelete);
}
// function deleteImage(product) {
//   const imageUrl = product.imageUrl; // === const {imageUrl} = product
//   const fileToDelete = imageUrl.split("/").at(-1); // récup la dernière partie de l'Url
//   return unlink(`images/${fileToDelete}`).then(() => product);
//   //return product // "Image upprimée" 1 string, return sinon ça return rien {}
//   //console.log("On va suppr le fichier :", product.imageUrl)
// }

function modifySauce(req, res) {
  const { id } = req.params; //destructuring
  //const body = req.body;;
  //const {id} = params // === const id = params.id
  //console.log("body et params :", body, id);
  console.log("req.file", req.file != null);

  const withChangeImg = req.file != null; // true ou false
  const payload = makePayload(withChangeImg, req);

  Product.findOne({ _id: req.params.id }).then((product) => {
    if (withChangeImg == true) {
      console.log("on est dans iFFFFFF");
      deleteImage(product);
      console.log("Image suppr !!!!!!!!");
    }
  });

  //Update dataBase
  Product.findByIdAndUpdate(id, payload)
    .then((dbRes) => sendClientResponse(dbRes, res))
    //.then((product) => deleteImage(product))
    .then((res) => console.log("File deleted", res))
    .catch((err) => console.error("PB Updating ! :", err));
}

function makePayload(withChangeImg, req) {
  console.log("withChangeImg", withChangeImg);
  if (!withChangeImg) return req.body; // comme avant sans image(file) que req.body
  const payload = JSON.parse(req.body.sauce);
  payload.imageUrl = makeImageUrl(req, req.file.fileName);
  console.log("New image à gérer");
  //console.log("Voici le body", req.body.sauce);
  console.log("Voici le payload :", payload);
  return payload;
}

function sendClientResponse(product, res) {
  if (product == null) {
    console.log("Nothing to update");
    return res.status(404).send({ message: "Object not found in database" });
  }
  console.log("All Good Updating", product);
  return Promise.resolve(res.status(200).send(product)).then(() => product);
  //return res.status(200).send({ message: "Successfully Updated" });
}

function makeImageUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName;
}

function createSauce(req, res) {
  // console.log("on est dans createSauce");
  // console.log(
  //   "req Url :",
  //   req.protocol + "://" + req.get("host") + req.originalUrl
  // );
  // console.log(__dirname);
  /********************** */
  //   const name = req.body.name;
  //   const manufacturer = req.body.manufacturer;
  // const name = sauce.name
  // const manufacturer = sauce.manufacturer
  // const description = sauce.description
  // const mainPepper = sauce.mainPepper
  // const heat = sauce.heat

  //console.log("sauce :", sauce)
  //console.log({ body: req.body });
  //console.log({file: req.file})
  // const body = req.body;
  // const file = req.file; // + court : const {body, file} = req
  //console.log({ file });
  //const fileName = file.fileName; // + court : const{fileName} = file
  const { body, file } = req;
  const { fileName } = file;
  const sauce = JSON.parse(body.sauce);
  //console.log({ body, file })
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce;
  //const imageUrl = req.file.destination + req.file.filename
  //console.log("imageUrl :", imageUrl)

  const product = new Product({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: makeImageUrl(req, fileName),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  product
    .save()
    .then((message) => res.status(201).send({ message: message }))
    //return console.log("produit enregistré", message);
    .catch((err) => res.status(500).send({ message: err }));
}

function likeSauce(req, res) {
  // console.log("Fct likeSaute invoquée, like :", like)
  // console.log("like vaut 0, -1 ou 1 ")
  const { like, userId } = req.body;
  //console.log("like, userId :", like, userId)
  if (![0, -1, 1].includes(like))
    return res.status(403).send({ message: "Invalid like value" });
  //console.log("like vaut 0, -1 ou 1 ")
  getSauce(req, res)
    .then((product) => updateVote(product, like, userId, res))
    .then((pr) => pr.save())
    .then((prod) => sendClientResponse(prod, res))
    .catch((err) => res.status(500).send(err));
  //const userId = req.body.userId
}

function updateVote(product, like, userId, res) {
  if (like === 1 || like === -1) return incrementVote(product, userId, like);
  //if(like === 0) return resetVote(product, userId, res)
  //return product.save()
  return resetVote(product, userId, res);
}

function resetVote(product, userId, res) {
  console.log("Reset vote before :", product);
  const { usersLiked, usersDisliked } = product;
  //const arrayToUpdate = usersLiked.includes(userId) ? usersLiked : usersDisliked
  if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
    return Promise.reject({ message: "user seems to have voted both ways" });

  if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
    return Promise.reject({ message: "user seems to have not voted" });

  //usersLiked.includes(userId) ? --product.likes : --product.dislikes
  // = à ça :
  // let votesToUpdate = usersLiked.includes(userId) ? product.likes : product.dislikes
  // votesToUpdate--
  // usersLiked.includes(userId) ? (product.likes = votesToUpdate) : (product.dislikes = votesToUpdate)
  //console.log("voteToUpdate :", voteToUpdate)

  if (usersLiked.includes(userId)) {
    --product.likes;
    product.usersLiked = product.usersLiked.filter((id) => id != userId);
  } else {
    --product.dislikes;
    product.usersDisliked = product.usersDisliked.filter((id) => id != userId);
  }
  // let arrayToUpdate = usersLiked.includes(userId) ? usersLiked : usersDisliked
  // arrayToUpdate = arrayToUpdate.filter(id => id != userId)
  console.log("Reset vote after :", product);
  return product;
}

function incrementVote(product, userId, like) {
  //console.log("ancien likes:", product.likes)
  const { usersLiked, usersDisliked } = product;

  const votersArray = like === 1 ? usersLiked : usersDisliked;
  if (votersArray.includes(userId)) return product;
  votersArray.push(userId);

  like === 1 ? ++product.likes : ++product.dislikes;
  return product;
}
/*********** égal à ça */
// if (like === 1) {
//   ++product.likes
// } else {
//  ++product.dislikes
// }
// return product
/************* égal à ça */
// let voteToUpdate
//   if (like === 1) {
//     voteToUpdate = product.likes
//     product.likes = voteToUpdate // ++voteUpdate
//   } else {
//     voteToUpdate = product.dislikes
//     product.dislikes = voteToUpdate // ++voteUpdate
//   }
//   voteToUpdate++ // pas nécessaire si on incrémente avant
//   product.likes = voteToUpdate
//   return product

//const {likes, dislikes} = product
//voteToUpdate = like === 1 ? product.likes : product.dislikes
//console.log("product après vote :", product)
//product.likes++
//console.log("nouveau likes:", product.likes)
//console.log("product after like:", product)

module.exports = {
  //sendClientResponse,
  //getSauce,
  getSauces,
  createSauce,
  getSauceById,
  deleteSauce,
  modifySauce,
  likeSauce,
};
