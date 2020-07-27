import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Components/Home/Home";
import CreatePost from "./Components/CreatePost/CreatePost";

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/create" component={CreatePost} />
    <Route render={() => <main>404 not found</main>} />
  </Switch>
);
