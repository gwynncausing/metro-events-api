var express = require("express");
var router = express.Router();
const { database } = require("../../database");
const { getRoleId, updateRole } = require("./user-functions");

router.use(function timeLog(req, res, next) {
  next();
});

router.patch("/update-role", async (req, res) => {
  const { id, role } = req.body;

  let roleId = await getRoleId(database, role);
  let updateStatus = await updateRole(database, id, roleId);

  if (updateStatus === 1) res.json(updateStatus);
  else res.json("User/role not found or has been deleted");
});

module.exports = router;
