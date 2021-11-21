var express = require("express");
var router = express.Router();
const { database } = require("../../database");

router.use(function timeLog(req, res, next) {
  next();
});

router.post("/create/:userId", async (req, res) => {
  const { title, type, description, datetime_start, datetime_end } = req.body;
  const { userId } = req.params;
  let result = {
    status: 400,
    message: "Cannot add event",
  };
  let event_id = -1;

  await database
    .insert({
      title: title,
      type: type,
      description: description,
      canceledAt: null,
      datetime_start: new Date(datetime_start),
      datetime_end: new Date(datetime_end),
      upvotes: 0,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .into("events")
    .then((data) => {
      console.log({ data });
      event_id = data[0];
    })
    .catch((err) => {
      console.log({ err });
    });

  if (event_id !== -1) {
    await database
      .insert({
        user_id: userId,
        event_id: event_id,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .into("organizer_events")
      .then((data) => {
        console.log({ data });
        result = { status: 200, message: data[0] };
      })
      .catch((err) => {
        console.log({ err });
      });
  }

  res.status(result.status).json(result.message);
});

router.get("/get-events/:userId", async (req, res) => {
  const { userId } = req.params;
  let events = [];

  await database
    .select("event_id")
    .from("organizer_events")
    .where({ user_id: userId })
    .then(async (data) => {
      // console.log(data);
      let _events = [];
      for (let event of data) {
        await database
          .select("*")
          .from("events")
          .where({ event_id: event.event_id })
          .then((data) => {
            _events.push(data[0]);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      console.log({ _events });
      events = _events;
    })
    .catch((err) => {
      console.log(err);
    });

  res.status(200).json(events);
});

router.get("/", async (req, res) => {
  let result = {
    status: 400,
    message: "Cannot get events",
  };
  await database
    .select("*")
    .from("events")
    .then((data) => {
      result = { status: 200, message: data };
    })
    .catch((err) => {
      result = { status: 200, message: "Cannot get events" };
    });

  res.status(result.status).json(result.message);
});

module.exports = router;
