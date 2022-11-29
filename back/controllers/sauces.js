const Product = require("../models/sauces");
const { unlink } = require("fs/promises");

function getSauces(req, res) {
  ///Product.deleteMany({}).then(console.log).catch(console.error);
  Product.find({})
    .then((products) => res.send(products))
    .catch((error) => res.status(400).send(error));
}

function getSauce(req, res) {
  //console.log("Request Id:", req.params.id); // au clique sur sauce on récup l'Id
  const { id } = req.params;
  return Product.findById(id);
}

function getSauceById(req, res) {
  getSauce(req, res)
    .then((product) => sendClientResponse(product, res))
    .catch((error) => res.status(404).send(error));
}

function deleteSauce(req, res) {
  // ajouter vérification UserId sur delete et modify
  const { id } = req.params;
  Product.findByIdAndDelete(id)
    .then((product) => sendClientResponse(product, res))
    .then((item) => deleteImage(item))
    .then((res) => console.log("FILE DELETED !", res)) // pas obligatoire
    .catch((err) => res.status(400).send({ message: err }));
}

function deleteImage(product) {
  const imageToDelete = product.imageUrl.split("/").at(-1);
  return unlink("images/" + imageToDelete);
}

function modifySauce(req, res) {
  const { id } = req.params; // destructuring, id de la sauce
  const withChangeImg = req.file != null; // 1 fichier IMAGE a été ajouté ?
  const payload = makePayload(withChangeImg, req);
  Product.findOne({ _id: req.params.id }).then((product) => {
    if (withChangeImg == true) {
      deleteImage(product);
    }
  });
  //Update dataBase
  Product.findByIdAndUpdate(id, payload)
    .then((dbRes) => sendClientResponse(dbRes, res))
    .then((res) => console.log("File modified or deleted :", res))
    .catch((err) => console.error("Problem Updating ! :", err));
}

function makePayload(withChangeImg, req) {
  if (!withChangeImg) return req.body; // comme avant sans image(file) que req.body
  const payload = JSON.parse(req.body.sauce);
  payload.imageUrl = makeImageUrl(req, req.file.fileName);
  //console.log("Voici le body", req.body.sauce);
  //console.log("Voici le payload :", payload);
  return payload;
}

function sendClientResponse(product, res) {
  if (product == null) {
    //console.log("Nothing to update");
    return res.status(404).send({ message: "Object not found in database" });
  }
  //console.log("All Good Updating", product);
  return Promise.resolve(res.status(200).send(product)).then(() => product);
}

function makeImageUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName;
}

function createSauce(req, res) {
  // console.log("req Url :", req.protocol + "://" + req.get("host") + req.originalUrl);
  // console.log({ body: req.body });
  const { body, file } = req; // const body = req.body;// const file = req.file;
  const { fileName } = file; // const fileName = file.fileName;
  //console.log({ file });
  const sauce = JSON.parse(body.sauce);
  //console.log("sauce :", sauce);
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce;
  // const imageUrl = req.file.destination + req.file.filename;
  //console.log("imageUrl :", imageUrl);
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
    .then((message) => res.status(201).send({ message }))
    .catch((err) => res.status(400).send({ message: err }));
}

/****************** Like  *************************/

function likeSauce(req, res) {
  const { like, userId } = req.body;
  //console.log("like, userId :", like, userId);
  if (![0, -1, 1].includes(like))
    return res.status(403).send({ message: "Invalid like value" });
  getSauce(req, res)
    .then((product) => updateVote(product, like, userId, res))
    .then((pr) => pr.save())
    .then((prod) => sendClientResponse(prod, res))
    .catch((err) => res.status(500).send(err));
}

function updateVote(product, like, userId, res) {
  if (like === 1 || like === -1) return incrementVote(product, userId, like);
  //if(like === 0) return resetVote(product, userId, res)
  return resetVote(product, userId, res);
}

function resetVote(product, userId, res) {
  const { usersLiked, usersDisliked } = product;
  //const arrayToUpdate = usersLiked.includes(userId) ? usersLiked : usersDisliked
  // Si toutes les array contiennent l'userId
  if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
    return Promise.reject({ message: "user seems to have voted both ways" }); // Promise.reject() pour le forcer à aller dans le catch
  // si dans ces 2 array, il y en a aucune des 2 qui contient cet userId
  if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
    return Promise.reject({ message: "user seems to have not voted" });

  if (usersLiked.includes(userId)) {
    --product.likes;
    product.usersLiked = product.usersLiked.filter((id) => id != userId);
  } else {
    --product.dislikes;
    product.usersDisliked = product.usersDisliked.filter((id) => id != userId);
  }
  return product;
}

function incrementVote(product, userId, like) {
  const { usersLiked, usersDisliked } = product;

  const votersArray = like === 1 ? usersLiked : usersDisliked;
  if (votersArray.includes(userId)) return product;
  votersArray.push(userId);

  like === 1 ? ++product.likes : ++product.dislikes;
  return product;
}

module.exports = {
  getSauces,
  createSauce,
  getSauceById,
  deleteSauce,
  modifySauce,
  likeSauce,
};

/******** LIKE ******** */
//usersLiked.includes(userId) ? --product.likes : --product.dislikes
// = à ça :
// let votesToUpdate = usersLiked.includes(userId) ? product.likes : product.dislikes
// votesToUpdate--
// usersLiked.includes(userId) ? (product.likes = votesToUpdate) : (product.dislikes = votesToUpdate)
//console.log("voteToUpdate :", voteToUpdate)
/********************** */

/********************* */
// let arrayToUpdate = usersLiked.includes(userId) ? usersLiked : usersDisliked
// arrayToUpdate = arrayToUpdate.filter(id => id != userId)
//console.log("Reset vote after :", product);

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
