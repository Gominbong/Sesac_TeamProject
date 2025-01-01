const express = require("express");
const db = require("./models");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const cors = require("cors");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const indexRouter = require("./routes");

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use("/", indexRouter);
app.use(cors());

app.get("*", (req, res) => {
  res.render("404");
});

db.sequelize.sync({ force: false, alter: false }).then((result) => {
  //console.log("DB연결 성공");
  //console.log("------------------------------");
  app.listen(PORT, () => {
    //console.log(`http://localhost:${PORT}`);
  });
});
