const { app, express } = require("./server");
const { saucesRouter } = require("./routers/sauces_router");
const { authRouter } = require("./routers/auth_router");
const port = 3000;
const path = require("path"); // ds node pour avoir le dirname et donner le chemin absolu

const bodyParser = require("body-parser");

//Connection to Database
require("./mongo");

//Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(bodyParser.json());
app.use("/api/sauces", saucesRouter);
app.use("/api/auth", authRouter);

//Routes
app.get("/", (req, res) => res.send("Hello World !"));

// Listen
app.use("/images", express.static(path.join(__dirname, "images"))); // multer
app.listen(port, () => console.log("Server listening on Port: " + port));
