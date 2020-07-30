import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Components/Home/Home";
import CreatePost from "./Components/CreatePost/CreatePost";
import Post from "./Components/Post/Post";
import About from "./Components/About/About";

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/create" component={CreatePost} />
    <Route path="/post/:postID" component={Post} />
    <Route path="/about" component={About} />
    <Route render={() => <main>404 not found</main>} />
  </Switch>
);
