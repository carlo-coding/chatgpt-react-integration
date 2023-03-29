const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const routes = require("./routes/index");
const app = express();
const port = 5897;

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
