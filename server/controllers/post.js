const stringEncoder = require("../lib/stringEncoder");

// only the fields that may or may not exist
const fields = [
  "name",
  "description",
  "icon_1",
  "icon_2",
  "icon_3",
  "icon_4",
  "grid_snap_x",
  "grid_snap_y",
  "absolute_snapping",
  "active_index",
  "book_id"
];

// recursively add all records in the records table to the database
const addRecords = async (db, records, postID, bookID) => {
  // records must be added from the top down, so book IDs can be gotten
  records.forEach(async (record) => {
    // retrieve children, then delete the from the record object
    const children = record.children;
    delete record.children;

    // add post and book IDs
    record.post_id = postID;
    if (bookID) record.book_id = bookID;

    // set any missing optional fields to NULL
    fields.forEach((fieldName) => {
      if (record[fieldName] === undefined) record[fieldName] = null;
    });

    // add to database
    const dbRes = await db.record.add(record);

    // add all children
    if (children) await addRecords(db, children, postID, dbRes[0].id);
  });
};

// recursively retrieve all records from the database
const getRecords = async (db, postID, bookID) => {
  let records = await db.record.get({ postID, bookID });
  // wrap in Promise.all() to wait for all promises in the array to be resolved before continuing
  await Promise.all(
    records.map(async (record) => {
      // retrieve and set children if necessary
      if (record.type === "book") record.children = await getRecords(db, postID, record.id);
      return record;
    })
  );

  return records;
};

module.exports = {
  create: async (req, res) => {
    const db = req.app.get("db");
    const { title, description, records } = req.body;
    const { userID: authorID } = req.session;
    // get current timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    // create post in database, get post ID
    const dbRes = await db.post.create({
      authorID,
      title,
      description,
      timestamp
    });
    const postID = dbRes[0].id;
    await addRecords(db, stringEncoder.decode(records), postID);
    res.status(200).send({ postID });
  },
  delete: async (req, res) => {
    const db = req.app.get("db");
    const { postID } = req.params;

    // delete records
    await db.record.delete_post(+postID);

    // delete post
    await db.post.delete(+postID);

    res.sendStatus(200);
  },
  getOne: async (req, res) => {
    const db = req.app.get("db");
    const { postID } = req.params;

    try {
      const dbRes = await db.post.get_one(+postID);
      let postData = dbRes[0];

      if (!postData) {
        res.status(400).send("Post does not exist");
      }

      // get records
      postData.records = stringEncoder.encode(await getRecords(db, +postID, null));

      res.status(200).send(postData);
    } catch {
      res.status(400).send("Post does not exist");
    }
  },
  getAll: async (req, res) => {
    const db = req.app.get("db");
    const { query } = req.query;

    const dbRes = await db.post.get_all(query);

    res.status(200).send(dbRes);
  },
  update: async (req, res) => {
    const db = req.app.get("db");
    const { title, description, records } = req.body;
    const { postID } = req.params;
    // get current timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    // delete all old records
    await db.record.delete_post(postID);
    // update post information
    await db.post.update({ id: postID, title, description, timestamp });
    // add all new records
    await addRecords(db, stringEncoder.decode(records), postID);
    res.sendStatus(200);
  }
};
