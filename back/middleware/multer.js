const multer = require("multer");
//objet de config pour multer
const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    //console.log({ file })
    cb(null, makeFileName(req, file));
  },
});

function makeFileName(req, file) {
  //console.log({ file });
  const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-");
  file.fileName = fileName;

  return fileName;
}

const upload = multer({ storage });

module.exports = { upload };
