const express = require("express");
const bodyParser = require("body-parser");

const { database } = require("./database");

const app = express();

const initializeTables = require("./controller/initializations/tables");
const initializeData = require("./controller/initializations/data");
const auth = require("./controller/auth/auth");
const user = require("./controller/user/user");
const request = require("./controller/request/request");

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.json({ name: "Hello World!" });
});

app.get("/get-users", (req, res) => {
  database
    .select("*")
    .table("user")
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(400).json("Unable to get user");
    });
});

app.get("/init", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const tables = await initializeTables.init(database);
  const data = await initializeData.init(res, database);
  res.json({ ...tables, ...data });
});

app.use("/", auth);
app.use("/user", user);
app.use("/request", request);

const port = 8081;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
