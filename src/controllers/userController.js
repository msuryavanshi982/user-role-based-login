const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {isValidRequestBody,isValidName,isValidPass,isValiddesignation} = require("../validator/validations");

// <<< === registered API === >>>
const registerUser = async function (req, res) {
  try {
    let data = req.body;

    // request Body validation
    if (!isValidRequestBody(data))
      return res.status(400).send({
        status: false,
        message: "Please provide data in request body!",
      });

    let { userName, password, designation } = data;

    // user name validation
    if (!userName)
      return res
        .status(400)
        .send({ status: false, message: "user name is required" });

    if (!isValidName(userName))
      return res
        .status(400)
        .send({ status: false, message: "user name must be valid" });

    let uniqueName = await userModel.findOne({ userName: userName });
    if (uniqueName) {
      return res
        .status(409)
        .send({ status: false, message: "Name is already exist" });
    }

    if (!designation) {
      return res.status(400).send({
        status: false,
        message: "designation must be admin or supervisor",
      });
    }
    if (!isValiddesignation(designation)) {
      return res
        .status(400)
        .send({ status: false, message: "designation must be valid" });
    }

    // password validation
    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });

    if (!isValidPass(password))
      return res.status(400).send({
        status: false,
        message:
          "Password should be between 8 and 15 character and it should be alpha numeric",
      });

    // encrypt the password and set into the db
    data.password = await bcrypt.hash(password, 10);
    const user = await userModel.create(data);
    return res.status(201).send({
      status: true,
      message: "User is created Sucessfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// <<< === Login API === >>>

const loginUser = async function (req, res) {
  try {
    let requestBody = req.body;

    if (!isValidRequestBody(requestBody))
      return res
        .status(400)
        .send({ status: false, message: "requestBody can't be empty" });

    let { userName, password } = requestBody; // destructuring

    // email validation
    if (!userName)
      return res
        .status(400)
        .send({ status: false, message: "user name is required" });

    //password validation
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    //User Present or Not
    let user = await userModel.findOne({ userName: userName });
    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "username is not present" });
    }

    // check user password with hashed password stored in the database
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword)
      return res
        .status(400)
        .send({ status: false, message: "Invalid password" });

    // generate the token
    let token = jwt.sign(
      {
        userId: user._id.toString(),
        designation: user.designation,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    return res.status(200).send({
      status: true,
      message: "User login successful",
      data: { userid: user._id, token: token },
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { registerUser, loginUser };
