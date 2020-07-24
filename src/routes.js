import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Components/Home/Home";

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route render={() => <div>404 not found</div>} />
  </Switch>
);
