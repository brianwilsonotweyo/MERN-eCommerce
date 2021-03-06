const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
    // cb(null, './client/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

//Loading validation function
const validateProductInput = require("../../validation/product.js");

//Load product model
const Product = require("../../models/Product");

//@route GET api/products/test
//@desc Test product route
//@access public
router.get("/test", (req, res) => res.json({
  msg: "Profile Works"
}));

//@route    Post api/products/add
//@desc     Add product
//@access   Private
router.post("/add", upload.single("image"), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  const {
    errors,
    isValid
  } = validateProductInput(req.body);

  if (!isValid) {
    //Return any erros with 400 status
    return res.status(400).json(errors);
  }

  Product.findOne({
    name: req.body.name
  }).then(product => {
    if (product) {
      errors.exist = "Item Already Exists";
      return res.status(400).json(errors);
    } else {
      const newProduct = new Product({
        name: req.body.name,
        image: req.file.path,
        description: req.body.description,
        category: req.body.category,
        quantity: req.body.quantity,
        price: req.body.price
      });
      newProduct
        .save()
        .then(product => res.json(product))
        .catch(err => res.status(404).json());
    }
  });
});

//@route    Get api/products/
//@desc     Get all products
//@access   Public
router.get("/", (req, res) => {
  const errors = {};

  Product.find()
    .then(products => {
      if (!products) {
        errors.noproduct = "There are no products";
        return res.status(404).json(errors);
      }

      res.json(products);
    })
    .catch(err => res.status(404).json());
});

//@route    GET api/products/:_id
//@desc     Get product by ID
//@access   Public

router.get("/:id", (req, res) => {
  //It will find one product
  Product.findOne({
      _id: req.params.id
    })
    .then(product => res.json(product))
    .catch(err =>
      res.status(404).json({
        product: "There is no product with this id"
      })
    );
});

//@route    DELETE api/products/:_id
//@desc     Delete product by ID
//@access   Private

// router.get("/:id", (req, res) => {
//   //It will find one product
//   Product.findOne({
//     _id: req.params.id
//   })
//     .then(product => res.json(product))
//     .catch(err =>
//       res.status(404).json({ product: "There is no product with this id" })
//     );
// });

module.exports = router;