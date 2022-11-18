const { app, express } = require("./server");
const { saucesRouter } = require("./routers/sauces_router");
const { authRouter } = require("./routers/auth_router");
const port = 3000;
const path = require("path"); // ds node pour avoir le dirname et donner le chemin absolu

const bodyParser = require("body-parser");

//Connection to Database
require("./mongo");

//Middleware
app.use(bodyParser.json());
app.use("/api/sauces", saucesRouter);
app.use("/api/auth", authRouter);
//Routes
app.get("/", (req, res) =>
  res.send("Hello World !")
); /* chemin général tout en bas */
//Listen
// console.log("----------------------");
// console.log("__dirname :", __dirname);
// console.log("chemin absolu images:", path.join(__dirname, "images"));
//app.use("/images", express.static("images")); // à mettre à la fin au dessus du listen pour le chemin de l'image

app.use("/images", express.static(path.join(__dirname, "images"))); // à mettre à la fin au dessus du listen pour le chemin de l'image
app.listen(port, () => console.log("listening on Port " + port));
