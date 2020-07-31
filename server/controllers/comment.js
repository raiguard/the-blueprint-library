const stringEncoder = require("../lib/stringEncoder");

module.exports = {
  add: async (req, res) => {
    const db = req.app.get("db");
    const { postID, authorID, content } = req.body;
    // get current timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    await db.comment.create({ postID, authorID, content, timestamp });
    res.sendStatus(200);
  },
  delete: async (req, res) => {
    const db = req.app.get("db");
    const { commentID } = req.params;
    await db.comment.delete(commentID);
    res.sendStatus(200);
  },
  getPost: async (req, res) => {
    const db = req.app.get("db");
    const { postID } = req.params;
    const comments = await db.comment.get_post(postID);
    res.status(200).send(stringEncoder.encode(comments));
  },
  deletePost: async (req, res, next) => {
    const db = req.app.get("db");
    const { postID } = req.params;
    await db.comment.delete_post(postID);
    next();
  }
};
