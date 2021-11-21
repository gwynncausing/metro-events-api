var express = require("express");
var router = express.Router();
const { database } = require("../../database");
const {
  request,
  getUserRequest,
  updateRequest,
  getOrganizerRequests,
} = require("./request-functions");

router.use(function timeLog(req, res, next) {
  next();
});

router.post("/:userId", async (req, res) => {
  await request(database, req, res);
});

router.put("/update-request", async (req, res) => {
  const result = await updateRequest(database, req);
  console.log("/update-request: ", result);
  res.status(result.status).json(result.message);
});

router.get("/get-requests/:userId", async (req, res) => {
  const result = await getUserRequest(database, req);
  res.status(result.status).json(result.message);
});

router.get("/get-organizer-requests", async (req, res) => {
  const result = await getOrganizerRequests(database);
  res.status(result.status).json(result.message);
});

module.exports = router;
