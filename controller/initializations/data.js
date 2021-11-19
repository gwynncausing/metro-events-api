const regularRole = async (db) => {
  let result = "";
  const timestamp = Date.now();

  await db("role")
    .insert({
      name: "regular",
      created_at: timestamp,
      updated_at: timestamp,
    })
    .then(() => {
      result = "OK";
    })
    .catch(() => {
      result = "NOT OK";
    });
  return result;
};

const organizerRole = async (db) => {
  let result = "";

  const timestamp = Date.now();

  await db("role")
    .insert({
      name: "organizer",
      created_at: timestamp,
      updated_at: timestamp,
    })
    .then(() => {
      result = "OK";
    })
    .catch(() => {
      result = "NOT OK";
    });
  return result;
};

const adminRole = async (db) => {
  let result = "";
  const timestamp = Date.now();

  await db("role")
    .insert({
      name: "admin",
      created_at: timestamp,
      updated_at: timestamp,
    })
    .then(() => {
      result = "OK";
    })
    .catch(() => {
      result = "NOT OK";
    });
  return result;
};

const addAdmin = async (db) => {
  let result = "OK";

  await db
    .transaction((trx) => {
      trx
        .select("role_id")
        .where("name", "admin")
        .from("role")
        .then((data) => {
          db.insert({
            first_name: "admin",
            last_name: "admin",
            username: "admin",
            password: "admin",
            role_id: data[0].role_id,
            created_at: new Date(),
            updated_at: new Date(),
          })
            .into("user")
            .then(() => {
              result = "OK";
            })
            .catch(() => {
              result = "NOT OK";
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(() => {
      result = "NOT OK";
    });

  return result;
};

const init = async (res, db) => {
  const _regularRole = await regularRole(db);
  const _organizerRole = await organizerRole(db);
  const _adminRole = await adminRole(db);
  const _addAdmin = await addAdmin(db);
  const data = {
    regularRole: _regularRole,
    organizerRole: _organizerRole,
    adminRole: _adminRole,
    addAdmin: _addAdmin,
  };
  return data;
};

module.exports = {
  init,
};
