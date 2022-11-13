const express = require("express")
const { getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce } = require("../controllers/sauces");

//Middleware
const { authenticateUser } = require("../middleware/auth");
const { upload } = require("../middleware/multer");//récup des fichiers(image) file
const saucesRouter = express.Router()

saucesRouter.get("/", authenticateUser, getSauces);
saucesRouter.post("/", authenticateUser, upload.single("image"), createSauce);
saucesRouter.get("/:id", authenticateUser, getSauceById)
saucesRouter.delete("/:id", authenticateUser, deleteSauce)
saucesRouter.put("/:id", authenticateUser, upload.single("image"), modifySauce) //upload.single("image"), 
saucesRouter.post("/:id/like",authenticateUser, likeSauce)


module.exports = {saucesRouter}