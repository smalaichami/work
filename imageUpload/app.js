const multer = require("multer");
const http = require("http");
const path = require("path");
const fs = require("fs");
const ejs=require('ejs');


const express = require("express");

const app = express();

app.set('view engine','ejs');

app.listen(8000, () => {
  console.log('Server is listening on port 8000 ');
});

app.get("/upload", (req,res)=>{
	res.render('upload');
 express.static(path.join(__dirname, "./public"));
})

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("image/jpeg")
    .end("Oops! Something went wrong!");
};


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/data/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage })


app.post("/upload",upload.single("file"),(req, res) => {
    const tempPath = req.file.originalname;
    const targetPath = path.join(__dirname, "./uploads");


console.log(req.file);

    if (path.extname(req.file.originalname).toLowerCase() === ".jpeg") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

       res
         .status(200)
         .end("File uploaded!");
     });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("image/jpeg")
          .end("Only .png files are allowed!");
      });
    }
  }
);