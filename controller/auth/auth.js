var express = require("express");
var router = express.Router();
const { database } = require("../../database");
const { isUsernameExist, getUser } = require("../user/user-functions");

router.use(function timeLog(req, res, next) {
  next();
});

router.post("/register", async (req, res) => {
  const result = await register(req);
  res.status(result.status).json(result.message);
});

const register = async (req) => {
  const { first_name, last_name, username, password, confirmpassword } =
    req.body;

  let result = {
    status: 200,
    message: "OK",
  };
  let id = 0;

  let usernameExist = await isUsernameExist(database, username);
  let passwordMatch = password == confirmpassword;
  if (usernameExist) {
    result = {
      status: 400,
      message: "Username Already exist",
    };
  } else if (!passwordMatch) {
    result = {
      status: 400,
      message: "Password not match",
    };
  } else {
    await database
      .transaction((trx) => {
        trx
          .select("role_id")
          .where("name", "regular")
          .from("role")
          .then(async (data) => {
            let _id = "";
            await database
              .insert({
                first_name: first_name,
                last_name: last_name,
                username: username,
                password: password,
                role_id: data[0].role_id,
                created_at: new Date(),
                updated_at: new Date(),
              })
              .into("user")
              .then((data) => {
                _id = data[0];
              })
              .catch((err) => {
                result = {
                  status: 400,
                  message: "Invalid inputs",
                };
              });

            id = _id;
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch((err) => {
        result = {
          status: 400,
          message: "Invalid inputs",
        };
      });

    result = await getUser(database, id);
  }

  return result;
};

router.post("/login", async (req, res) => {
  const result = await login(req);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(400).json("Invalid username or password");
  }
});

const login = async (req) => {
  const { username, password } = req.body;

  let result = "OK";

  await database
    .select("*")
    .where({ username: username, password: password })
    .from("user")
    .then((data) => {
      result = data[0];
    })
    .catch(() => {
      result = "NOT OK";
    });

  return result;
};

module.exports = router;
