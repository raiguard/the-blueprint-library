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
      record[fieldName] = record[fieldName] || null;
    });

    // add to database
    const dbRes = await db.record.add(record);

    // add all children
    if (children) addRecords(db, children, postID, dbRes[0].id);
  });
};

// brute-force delete records and recreate them when editing a post
const deleteRecords = async (postID) => {};

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
    await addRecords(db, records, postID);
    res.sendStatus(200);
  },
  edit: (req, res) => {},
  delete: (req, res) => {},
  getOne: (req, res) => {},
  getAll: (req, res) => {}
};
