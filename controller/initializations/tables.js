const role = async (db) => {
  let result = "";
  await db.schema
    .createTable("role", function (table) {
      table.increments("role_id");
      table.string("name").unique({ indexName: "role_unique_name1" });
      table.timestamps();
    })
    .then(() => {
      result = "OK";
    })
    .catch(() => {
      result = "NOT OK";
    });
  return result;
};

const user = async (db) => {
  let result = "";

  await db.schema
    .createTable("user", function (table) {
      table.increments("user_id");
      table.string("first_name");
      table.string("last_name");
      table.string("username").unique({ indexName: "user_unique_username" });
      table.string("password");
      table.integer("role_id").unsigned().notNullable();
      table.timestamps();

      table.foreign("role_id").references("role_id").inTable("role");
    })
    .then(() => {
      result = "OK";
    })
    .catch(() => {
      result = "NOT OK";
    });
  return result;
};

const events = async (db) => {
  let result = "";

  await db.schema
    .createTable("events", function (table) {
      table.increments("event_id");
      table.string("title");
      table.string("type");
      table.string("description");
      table.datetime("canceledAt");
      table.datetime("datetime_start");
      table.datetime("datetime_end");
      table.integer("upvotes");
      table.timestamps();
    })
    .then(() => {
      result = "OK";
    })
    .catch(() => {
      result = "NOT OK";
    });
  return result;
};

const review = async (db) => {
  let result = "";

  await db.schema
    .createTable("review", function (table) {
      table.increments("review_id");
      table.string("title");
      table.string("comment");
      table.timestamps();
    })
    .then(() => {
      result = "OK";
    })
    .catch(() => {
      result = "NOT OK";
    });
  return result;
};

const user_review = async (db) => {
  let result = "";

  await db.schema
    .createTable("user_review", function (table) {
      table.increments("user_review_id");
      table.integer("user_id").unsigned().notNullable();
      table.integer("event_id").unsigned().notNullable();
      table.integer("review_id").unsigned().notNullable();

      table.foreign("user_id").references("user_id").inTable("user");
      table.foreign("event_id").references("event_id").inTable("event");
      table.foreign("review_id").references("review_id").inTable("review");

      table.timestamps();
    })
    .then(() => {
      result = "OK";
    })
    .catch(() => {
      result = "NOT OK";
    });
  return result;
};

const organizer_events = async (db) => {
  let result = "";

  await db.schema
    .createTable("organizer_events", function (table) {
      table.increments("organizer_events_id");

      table.integer("user_id").unsigned().notNullable();
      table.integer("event_id").unsigned().notNullable();

      table.foreign("user_id").references("user_id").inTable("user");
      table.foreign("event_id").references("event_id").inTable("event");

      table.timestamps();
    })
    .then(() => {
      result = "OK";
    })
    .catch(() => {
      result = "NOT OK";
    });
  return result;
};

const request = async (db) => {
  let result = "";

  await db.schema
    .createTable("request", function (table) {
      table.increments("request_id");

      table.integer("user_id").unsigned().notNullable();
      table.integer("event_id").unsigned();
      table.string("request_type").notNullable();
      table.string("request_status");

      table.foreign("user_id").references("user_id").inTable("user");
      table.foreign("event_id").references("event_id").inTable("event");

      table.timestamps();
    })
    .then(() => {
      result = "OK";
    })
    .catch((err) => {
      result = "NOT OK";
    });
  return result;
};

const init = async (db) => {
  const _role = await role(db);
  const _user = await user(db);
  const _events = await events(db);
  const _review = await review(db);
  const _user_review = await user_review(db);
  const _organizer_events = await organizer_events(db);
  const _request = await request(db);
  const data = {
    role: _role,
    user: _user,
    events: _events,
    review: _review,
    user_review: _user_review,
    organizer_events: _organizer_events,
    request: _request,
  };
  return data;
};

module.exports = {
  init,
};
