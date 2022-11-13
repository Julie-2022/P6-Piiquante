const mongoose = require("mongoose");
const {unlink} = require("fs/promises");
//const {unlink} = require("fs")// === const unlink = require("fs").unlink, pouvoir suppr image

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

function getSauceById(req, res) {
  console.log("Request Id:", req.params.id); // au clique sur sauce on récup l'Id
  const id = req.params.id; // === const {id} = req.params
  const product = Product.findById(id) //console.log("Le produit avec cet Id :", product) //== .then(console.log)
    .then((products) => res.send(products))
    .catch((error) => res.status(500).send(error));
}

function deleteSauce(req, res) {
  const { id } = req.params;
  //1- Ordre de suppr envoyé à Mongo
  Product.findByIdAndDelete(id) // === Product.findOneAndDelete({_id: id})
    //2- suppr l'image localement
    .then(deleteImage) //(product)
    //console.log("produit supprimé :", product)
    //3- envoyer un mess de succès au site(clt)
    .then((product) => sendClientResponse(product, res))
    //.then ((product) => console.log("Cette sauce est bien supprimée", product))
    .catch((err) => res.status(500).send({ message: err }));
}

function deleteImage(product) {
  const imageUrl = product.imageUrl; // === const {imageUrl} = product
  const fileToDelete = imageUrl.split("/").at(-1); // récup la dernière partie de l'Url
  return unlink(`images/${fileToDelete}`).then(() => product);
  //return product // "Image upprimée" 1 string, return sinon ça return rien {}
  //console.log("On va suppr le fichier :", product.imageUrl)
}

function modifySauce(req, res) {
  const {params: {id}} = req; //destructuring
  const { body } = req;
  //const {id} = params // === const id = params.id
  console.log("body et params :", body, params);
  //Updatee dataBase
   Product.findByIdAndUpdate(id, body)
//     .then((product) => sendClientResponse(product, res))
//     .catch((err) => console.error("PB Updating ! err :", err));
// }
.then((product) => {
//function sendClientResponse(product, res) {
  if (product == null) {
    console.log("Nothing to update");
    /*return*/ res.status(404).send({ message: "Object to update not found in database" });
  }
  console.log("All good, Updating :", product);
  res.status(200).send({ message: "Successfully updated" });
})
.catch((err) => console.error("PB Updating ! err :", err));
}


//   let product = req.body;
//   if (req.file =! null) {
//    console.log("Une image a été mise à jour", req.body)
//    sauce = req.body.sauce
//  }
//   let name, manufacturer, description, mainPepper, heat, userId;

//   name = product.name;
//   manufacturer = product.manufacturer;
//   description = product.description;
//   mainPepper = product.mainPepper;
//   heat = product.heat;
//   userId = product.userId;

//   const { id } = req.params;
//   console.log({ body, file });
//   Product.findByIdAndUpdate(id, {
//     name,
//     manufacturer,
//     description,
//     mainPepper,
//     heat,
//     userId,
//   })
//     .then((res) => console.log("find one and Update", res))
//     .catch(console.error);
//}

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
  const body = req.body;
  const file = req.file; // + court : const {body, file} = req
  //console.log({ file });
  const fileName = file.fileName; // + court : const{fileName} = file
  const sauce = JSON.parse(body.sauce);
  //console.log({ body, file })
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce;
  //const imageUrl = req.file.destination + req.file.filename
  //console.log("imageUrl :", imageUrl)
  function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/images/" + fileName;
  }

  const product = new Product({
    userId,
    name,
    manufacturer,
    description,
    mainPepper,
    imageUrl: makeImageUrl(req, fileName),
    heat: 0,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  product
    .save()
    .then((message) => {
      res.send({ message: message });
      return console.log("produit enregistré", message);
    })
    .catch(console.error);
}

module.exports = {
  getSauces,
  createSauce,
  getSauceById,
  deleteSauce,
  modifySauce,
};
