const productModel = require("../models/productModel");
const orderModel = require("../models/oderModel");
const {isValidObjectId, isValidRequestBody} = require("../validator/validations");

// <<< === create Update === >>>
const createOrder = async (req, res) => {
  try {
    let { quantity, status, paid } = req.body;
    let { productId } = req.params;
    let userId = req.payload.userId;

    let product = await productModel.findOne({ productId: productId });
    if (!product) {
      return res.status(404).send({ status: false, message: "data not found" });
    }
    let orderData = {
      userId: userId,
      productId: productId,
      productName: product.productName,
      date: new Date(),
      quantity: quantity,
      totalPrice: product.price * Number(quantity),
      status: status,
      paid: paid,
      refund: product.refundable,
    };
    let order = await orderModel.create(orderData);
    return res
      .status(201)
      .send({ status: true, message: "order placed", data: order });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// <<< === get orders API === >>>
const getOrders = async (req, res) => {
  try {
    let { userId } = req.payload;

    const orders = await orderModel.find({ userId: userId });
    if (!orders) {
      return res.status(404).send({ status: false, message: "data not found" });
    }
    return res
      .status(200)
      .send({ status: true, message: "data found", data: orders });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// <<< === Order Update === >>>
const updateOrderDetails = async function (req, res) {
  try {
    let { orderId } = req.params;

    let { userId } = req.payload;
    let data = req.body;
    let { quantity, status } = data;

    if (!orderId)
      return res.status(400).send({
        status: false,
        message: "please provide orderId in the requset body",
      });

    if (!isValidObjectId(orderId))
      return res
        .status(400)
        .send({ status: false, message: "orderId is not valid" });

    if (!isValidRequestBody(data))
      return res.status(400).send({
        status: false,
        message: "Please provide data in the request body",
      });

    let currentOrder = await orderModel.findOne({
      _id: orderId,
      userId: userId,
    });
    if (!currentOrder)
      return res.status(400).send({
        status: false,
        message: "order is not exist with given orderId",
      });

    if (currentOrder.status === "cancelled") {
      return res
        .status(400)
        .send({ status: false, message: "your order is already cancelled" });
    }

    if (status) {
      let statusType = ["pending", "approved", "cancelled"];
      if (statusType.indexOf(status) == -1) {
        return res.status(400).send({
          status: false,
          message:
            "Please provide status from these options only ('pending', 'approved' or 'cancelled')",
        });
      }
    }
    if (status === "pending") {
      if (currentOrder.status === "approved") {
        return res
          .status(400)
          .send({ status: false, message: "your order already approved" });
      }
    }

    if (quantity) {
      data.totalPrice =
        (currentOrder.totalPrice / currentOrder.quantity) * quantity;
    }

    const updateStatus = await orderModel.findOneAndUpdate(
      { _id: orderId, userId: userId },
      data,
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Success", data: updateStatus });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

// <<< === payment API === >>>
const payment = async (req, res) => {
  try {
    const { userId } = req.payload;

    const order = await orderModel.find({ userId: userId, paid: false });

    if (order.length === 0) {
      return res
        .status(404)
        .send({ status: false, message: "Order not found" });
    }

    let data = await orderModel.updateMany(
      { userId: userId, paid: false },
      { $set: { paid: true } },
      { upsert: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Payment received", data: data });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderDetails,
  payment,
};
