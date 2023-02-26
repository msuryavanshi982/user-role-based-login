const express = require("express");
const route = require("./routes/routes");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const app = express();

app.use(express.json());

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.URL, { useNewUrlParser: true })
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT, function () {
  console.log("Express app running on port " + process.env.PORT);
});
