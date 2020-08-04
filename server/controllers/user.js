module.exports = {
  getOne: async (req, res) => {
    const db = req.app.get("db");
    const { userID } = req.params;

    const dbRes = await db.user.get_one(userID);
    const user = dbRes[0];
    if (user) {
      return res.status(200).send(user);
    }
    return res.sendStatus(400);
  }
};
