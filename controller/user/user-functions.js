const getRoleId = async (database, role) => {
  let roleId = -1;

  await database
    .select("role_id")
    .where("name", role)
    .from("role")
    .then((data) => {
      roleId = data[0].role_id;
    })
    .catch(() => {
      roleId = -1;
    });
  return roleId;
};

const updateRole = async (database, user_id, role_id) => {
  let returnData = "";
  await database("user")
    .where({ user_id: user_id })
    .update({ role_id: role_id })
    .then((data) => {
      returnData = data;
    })
    .catch((err) => {
      console.log("err", err);
    });
  return returnData;
};

const isUserExist = async (database, user_id) => {
  let result = -1;

  await database
    .select("user_id")
    .where({ user_id: user_id })
    .from("user")
    .then((data) => {
      result = data[0].user_id;
    })
    .catch(() => {
      result = 0;
    });

  return result;
};

const isUsernameExist = async (database, username) => {
  let result = -1;

  await database
    .select("user_id")
    .where({ username: username })
    .from("user")
    .then((data) => {
      result = data[0].user_id;
    })
    .catch(() => {
      result = 0;
    });

  return result;
};

const getUser = async (database, user_id) => {
  let result = { status: 400, message: "Error" };

  await database
    .select("*")
    .where("user_id", user_id)
    .from("user")
    .then((data) => {
      result = { status: 200, message: data[0] };
    })
    .catch(() => {
      result = { status: 400, message: "User not found" };
    });

  return result;
};

module.exports = {
  getRoleId,
  updateRole,
  isUserExist,
  isUsernameExist,
  getUser,
};
