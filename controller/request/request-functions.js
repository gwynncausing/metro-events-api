const { REQUEST_TYPE, REQUEST_STATUS } = require("../../utils/constants");
const { isUserExist } = require("../user/user-functions");
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
  const { user_id, request_type, event_id } = req.body;

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
  let returnData = "";

  const _request_status = getRequestStatus(status);

  if (_request_status === "N/A") {
    returnData = "Request status invalid";
  } else {
    const isExist = await isRequestExist(database, request_id);
    if (!isExist) {
      returnData = "Request id not found";
    } else {
      await database("request")
        .where({ request_id: request_id })
        .update({ request_status: _request_status })
        .then((data) => {
          returnData = data;
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }

  return returnData;
};

module.exports = {
  request,
  updateRequest,
};
