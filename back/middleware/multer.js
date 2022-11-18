const multer = require("multer");

const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    //console.log({file})
    cb(null, makeFileName(req, file));
  },
});

function makeFileName(req, file) {
  console.log({ file });
  const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-"); //ext à la fin + regex pour enlever tous les espaces
  file.fileName = fileName;
  //console.log({ filename }); = is not defined
  console.log({ fileName });

  return fileName;
}

const upload = multer({ storage }); // =({storage: storage})

module.exports = { upload };
