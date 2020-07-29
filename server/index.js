require("dotenv").config();
const express = require("express"),
  session = require("express-session"),
  massive = require("massive"),
  authCtrl = require("./controllers/auth"),
  postCtrl = require("./controllers/post"),
  { CONNECTION_STRING, SERVER_PORT, SESSION_SECRET } = process.env,
  app = express();

app.use(express.json());

// session
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
  })
);

// database
massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
})
  .then((db) => {
    app.set("db", db);
    console.log("Database connection established");
  })
  .catch((err) => console.log(err));

// endpoints
app.get("/auth/me", authCtrl.checkSession);
app.post("/auth/register", authCtrl.register);
app.post("/auth/signin", authCtrl.signIn);
app.post("/auth/signout", authCtrl.signOut);

app.get("/api/post/:postID", postCtrl.getOne);
app.get("/api/posts", postCtrl.getAll);
app.post("/api/post", postCtrl.create);

// listen
app.listen(SERVER_PORT, () => console.log(`Server started on port ${SERVER_PORT}`));
