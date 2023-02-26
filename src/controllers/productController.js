const productModel = require("../models/productModel");
const {isValidProductId, isValidRequestBody, isValidPrice} = require("../validator/validations");

// <<< === create product API === >>>
const createProduct = async (req, res) => {
  try {
    let roles = req.user.designation;
    if (roles !== "admin") {
      res.status(403).send({ status: false, message: "unauthorized access" });
    }
    let { productName, price, refundable } = req.body;
    let products = await productModel.find();
    var productId = "";
    if (products.length > 0) {
      let lastProduct = products[products.length - 1];
      let lastProductId = lastProduct.productId.split("");
      let lastProductNumber = lastProductId
        .slice(3, lastProductId.length)
        .join("");
      productId = "PID" + `${Number(lastProductNumber) + 1}`;
    } else {
      productId = "PID1";
    }
    const product = await productModel.create({
      productId,
      productName,
      price,
      refundable,
    });

    return res
      .status(201)
      .send({ status: true, message: "product created", data: product });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// <<< === get products API === >>>
const getProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    if (products.length === 0) {
      return res.status(404).send({ status: false, message: "data not found" });
    }
    return res
      .status(200)
      .send({ status: true, message: "data found ", data: products });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// <<< === get product by Id API === >>>
const getProductById = async (req, res) => {
  try {
    let { productId } = req.params;
    //validation of productID
    if (!productId)
      return res.status(400).send({
        status: false,
        message: "Product Id is missing",
      });

    if (!isValidProductId(productId))
      return res
        .status(400)
        .send({ status: false, message: "ProductId is Invalid" });

    const product = await productModel.findOne({ productId: productId });
    if (!product) {
      return res.status(404).send({ status: false, msg: "No product exits" });
    }
    return res
      .status(200)
      .send({ status: true, message: "data found", data: product });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// <<< === update product API === >>>
const updateProduct = async (req, res) => {
  try {
    let roles = req.user.designation;
    if (roles !== "admin") {
      res.status(403).send({ status: false, message: "unauthorized access" });
    }
    let data = req.body;
    const { productId } = req.params;
    if (!productId)
      return res.status(400).send({
        status: false,
        message: "Product Id is missing",
      });

    if (!isValidProductId(productId))
      return res
        .status(400)
        .send({ status: false, message: "ProductId is Invalid" });

    if (!isValidRequestBody(data))
      return res
        .status(400)
        .send({ status: false, message: "update Body can't be empty" });

    let { productName, price } = data;
    if (productName) {
      data.productName = productName;
    }

    if (price) {
      if (!isValidPrice(price))
        return res
          .status(400)
          .send({ status: false, message: "Enter a proper price" });

      data.price = price;
    }

    const product = await productModel.findOne({ productId });
    if (!product) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }

    let updatedData = await productModel.findOneAndUpdate(
      { productId: productId },
      { $set: data },
      {
        new: true,
      }
    );
    return res.status(200).send({
      status: true,
      message: "data update successfully",
      data: updatedData,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// <<< === delete product API === >>>
const deleteProduct = async (req, res) => {
  try {
    let roles = req.user.designation;
    if (roles !== "admin") {
      res.status(403).send({ status: false, message: "unauthorized access" });
    }
    const { productId } = req.params;

    const product = await productModel.findOne({ productId });

    if (!product) {
      return res
        .status(404)
        .send({ status: false, messgae: "Product not found" });
    }

    await productModel.findOneAndDelete({ productId: productId });

    return res
      .status(200)
      .send({ status: true, message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
