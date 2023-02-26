const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

//====Authentication==============>>>
const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .send({ status: false, message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    if (Date.now() > payload.exp * 1000)
      return res.status(440).send({
        status: false,
        message: "session expired, please login again",
      });

    const user = await userModel.findById(payload.userId);
    if (!user) {
      return res.status(401).send({ status: false, message: "User not found" });
    }

    req.user = user;
    req.payload = payload;

    next();
  } catch (err) {
    res.status(401).send({ status: false, message: err.message });
  }
};

//====Authorization==============>>>
const authorization = (req, res, next) => {
  try {
    let designations = ["admin", "supervisor"];
    // Check if the user is authorized based on their designation
    if (!designations.includes(req.payload.designation)) {
      return res
        .status(403)
        .send({ status: false, message: "unauthorized access" });
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { authentication, authorization };
