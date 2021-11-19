var express = require("express");
var router = express.Router();
const { database } = require("../../database");
const { request, updateRequest } = require("./request-functions");

router.use(function timeLog(req, res, next) {
  next();
});

router.post("/", async (req, res) => {
  await request(database, req, res);
});

router.patch("/update-request", async (req, res) => {
  const result = await updateRequest(database, req);
  res.json(result);
});

module.exports = router;
