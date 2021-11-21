const { REQUEST_TYPE, REQUEST_STATUS } = require("../../utils/constants");
const { isUserExist, updateRole } = require("../user/user-functions");
const getRequestStatus = (status) => {
  let _request_status = "";
  switch (status) {
    case 1:
      _request_status = REQUEST_STATUS.REVIEW;
      break;
    case 2:
      _request_status = REQUEST_STATUS.ACCEPTED;
      break;
    case 3:
      _request_status = REQUEST_STATUS.DENIED;
      break;
    default:
      _request_status = "N/A";
  }
  return _request_status;
};

const getRequestType = (request_type) => {
  let _request_type = "";
  switch (request_type) {
    case 1:
      _request_type = REQUEST_TYPE.JOIN_EVENT;
      break;
    case 2:
      _request_type = REQUEST_TYPE.PROMOTE_ORGANIZER;
      break;
    case 3:
      _request_type = REQUEST_TYPE.PROMOTE_ADMIN;
      break;
    default:
      _request_type = "N/A";
  }
  return _request_type;
};

const isRequestExist = async (database, request_id) => {
  let isExist = false;
  await database
    .select("*")
    .from("request")
    .where({ request_id: request_id })
    .then((data) => {
      if (data.length) {
        isExist = true;
      }
    })
    .catch((err) => {
      isExist = false;
    });
  return isExist;
};

const isSameRequestExist = async (database, user_id, request_id) => {
  let isExist = false;
  await database
    .select("*")
    .from("request")
    .where({
      user_id: user_id,
      request_id: request_id,
    })
    .then((data) => {
      if (data.length) {
        isExist = true;
      }
    })
    .catch((err) => {
      isExist = false;
    });
  return isExist;
};

const getUserRequest = async (database, req) => {
  const { userId } = req.params;
  const user_id = userId;
  let result = {
    status: 400,
    message: "User not found.",
  };
  await database
    .select("*")
    .from("request")
    .where({
      user_id: user_id,
    })
    .then((data) => {
      result = { status: 200, message: data };
    })
    .catch((err) => {
      console.log(err);
    });

  return result;
};

const getOrganizerRequests = async (database) => {
  let result = {
    status: 400,
    message: "cannot get requests",
  };
  await database
    .select(
      "request.request_id",
      "request.user_id",
      "user.first_name",
      "user.last_name",
      "request.created_at"
    )
    .from("request")
    .innerJoin("user", "user.user_id", "=", "request.user_id")
    .where({
      request_type: REQUEST_TYPE.PROMOTE_ORGANIZER,
      request_status: REQUEST_STATUS.REVIEW,
    })
    .then((data) => {
      result = { status: 200, message: data };
    })
    .catch((err) => {
      console.log(err);
    });

  return result;
};

const createRequest = async (
  database,
  user_id,
  request_type,
  event_id = null
) => {
  let result = 0;
  await database
    .insert({
      user_id: user_id,
      event_id: event_id,
      request_type: request_type,
      request_status: REQUEST_STATUS.REVIEW,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .into("request")
    .then((data) => {
      result = 1;
    })
    .catch((err) => {
      result = 0;
    });

  return result;
};

const request = async (database, req, res) => {
  const { request_type, event_id } = req.body;
  const { userId } = req.params;
  const user_id = userId;

  const _request_type = getRequestType(request_type);
  if (_request_type === "N/A") {
    res.status(400).json("Request type invalid");
    return;
  }
  let isExist = await isUserExist(database, user_id);
  if (isExist === 0) {
    res.status(400).json("User does not exist");
    return;
  } else {
    let request = "";

    // TODO: add checking for event_id

    request = await createRequest(database, user_id, _request_type, event_id);

    res.status(200).json(request);
    return;
  }
};

const updateRequest = async (database, req) => {
  const { request_id, status } = req.body;
  let returnData = {
    status: 400,
    message: "Invalidi Request",
  };

  const _request_status = getRequestStatus(status);

  if (_request_status === "N/A") {
    returnData = "Request status invalid";
  } else {
    const isExist = await isRequestExist(database, request_id);
    if (!isExist) {
      returnData = "Request id not found";
    } else {
      await database
        .transaction((trx) => {
          trx
            .where({ request_id: request_id })
            .update({ request_status: _request_status })
            .from("request")
            .then(async (data) => {
              let returnData = {};
              if (data === 1 && _request_status === REQUEST_STATUS.ACCEPTED) {
                await database
                  .select("user_id", "request_type")
                  .from("request")
                  .where({ request_id: request_id })
                  .then((data2) => {
                    returnData = {
                      user_id: data2[0].user_id,
                      request_type: data2[0].request_type,
                    };
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
              return returnData;
            })
            .then(async (data) => {
              let value = "";
              if (data) {
                if (data.request_type === REQUEST_TYPE.PROMOTE_ORGANIZER) {
                  value = await updateRole(database, data.user_id, 2);
                } else if (data.request_type === REQUEST_TYPE.PROMOTE_ADMIN) {
                  value = await updateRole(database, data.user_id, 3);
                }
              }
              returnData = { status: 200, message: value };
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  return returnData;
};

module.exports = {
  request,
  updateRequest,
  getUserRequest,
  getOrganizerRequests,
};
