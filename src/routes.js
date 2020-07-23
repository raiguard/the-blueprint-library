import React from "react";
import { Route, Switch } from "react-router-dom";

export default (
  <Switch>
    <Route exact path="/" render={() => <div>Home</div>} />
    <Route path="/new" render={() => <div>New</div>} />
    <Route path="/edit" render={() => <div>Edit</div>} />
    <Route path="/post" render={() => <div>Post</div>} />
    <Route path="/profile" render={() => <div>Profile</div>} />
    <Route render={() => <div>404 not found</div>} />
  </Switch>
);
