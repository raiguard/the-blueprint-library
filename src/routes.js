import React from "react";
import { Route, Switch } from "react-router-dom";
import About from "./Components/About/About";
import AuthorPost from "./Components/AuthorPost/AuthorPost";
import Home from "./Components/Home/Home";
import Post from "./Components/Post/Post";
import Profile from "./Components/Profile/Profile";

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/create" component={AuthorPost} />
    <Route path="/edit/:postID" component={AuthorPost} />
    <Route path="/post/:postID" component={Post} />
    <Route path="/about" component={About} />
    <Route path="/profile/:userID" component={Profile} />
    <Route render={() => <main>404 not found</main>} />
  </Switch>
);
