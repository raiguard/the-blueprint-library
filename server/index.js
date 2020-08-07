require("dotenv").config();
const express = require("express"),
  session = require("express-session"),
  massive = require("massive"),
  authCtrl = require("./controllers/auth"),
  commentCtrl = require("./controllers/comment"),
  postCtrl = require("./controllers/post"),
  s3Ctrl = require("./controllers/s3"),
  userCtrl = require("./controllers/user"),
  { CONNECTION_STRING, SERVER_PORT, SESSION_SECRET } = process.env,
  path = require("path"),
  app = express();

app.use(express.json({ limit: "50mb" }));

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

app.delete("/api/post/:postID", commentCtrl.deletePost, postCtrl.delete);
app.get("/api/post/:postID", postCtrl.getOne);
app.get("/api/posts", postCtrl.getAll);
app.post("/api/post", postCtrl.create);
app.put("/api/post/:postID", postCtrl.update);

app.delete("/api/comment/:commentID", commentCtrl.delete);
app.get("/api/comments/:postID", commentCtrl.getPost);
app.post("/api/comment", commentCtrl.add);
app.put("/api/comment/:commentID", commentCtrl.edit);

app.get("/api/sign-s3", s3Ctrl.sign);

app.get("/api/user/:userID", userCtrl.getOne);

// BrowserRouter
app.use(express.static(__dirname + "/../build"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

// listen
app.listen(SERVER_PORT, () => console.log(`Server started on port ${SERVER_PORT}`));
