const bcrypt = require("bcryptjs");

module.exports = {
  checkSession: async (req, res) => {
    const db = req.app.get("db");
    const { userID } = req.session;

    const existingUser = await db.user.get_one(userID);
    if (existingUser[0]) {
      return res.status(200).send(existingUser[0]);
    } else {
      return res.sendStatus(204);
    }
  },
  register: async (req, res) => {
    const db = req.app.get("db");
    const { username, password } = req.body;

    // check to see if the user already exists
    const existingUser = await db.user.get_one(username);
    if (existingUser[1]) {
      return res.status(409).send("Username already taken");
    }

    // generate hash and create user
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const newUser = await db.user.register({ username, password: hash, avatar: `https://robohash.org/${username}` });

    // set session and return
    req.session.userID = newUser[0].id;
    return res.status(200).send(newUser[0]);
  },
  signIn: async (req, res) => {
    const db = req.app.get("db");
    const { username, password } = req.body;

    // be certain the user actually exists
    const userArr = await db.user.get_complete(username);
    const existingUser = userArr[0];
    if (!existingUser) {
      return res.status(400).send("Username or password is incorrect");
    }

    // generate hash and compare
    const authenticated = bcrypt.compareSync(password, existingUser.password);
    if (!authenticated) {
      return res.status(400).send("Username or password is incorrect");
    }

    // remove password and sign in
    delete existingUser.password;
    req.session.userID = existingUser.id;
    return res.status(200).send(existingUser);
  },
  signOut: async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  }
};
