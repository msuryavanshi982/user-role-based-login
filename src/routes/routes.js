const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct} = require("../controllers/productController");
const { createOrder, getOrders, updateOrderDetails, payment} = require("../controllers/orderController");
const { authentication, authorization } = require("../middleware/auth");

// user APIs ===>>>
router.post("/register", registerUser);
router.post("/login", loginUser);

// product APIs ===>>>
router.post("/product", authentication, authorization, createProduct);
router.get("/getProducts", authentication, getProducts);
router.get("/getProduct/:productId", authentication, getProductById);
router.put("/updateProduct/:productId", authentication, authorization, updateProduct);
router.delete("/deleteProduct/:productId", authentication, authorization, deleteProduct);

// order APIs ===>>>
router.post("/order/:productId", authentication, authorization, createOrder);
router.get('/order', authentication, authorization,getOrders);
router.put('/order/:orderId', authentication, authorization, updateOrderDetails);

// payment API ===>>>
router.post('/payment', authentication, authorization, payment);

router.all("/*", function (req, res) {
  res
    .status(400)
    .send({ status: false, message: "The api you request is not available" });
});

module.exports = router;
