const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("config");
const passport = require('passport');

const auth = require("./routes/auth");
const api = require("./routes/api");

//DB Setup
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URI || config.DBHost
);

const app = express();

//App Setup
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json({ type: "*/*" }));

app.use("/auth", auth);
app.use("/api", api);

//Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on: ", port);

module.exports = app;